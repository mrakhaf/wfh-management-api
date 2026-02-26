import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceEntity } from './entities/attendance.entity';
import dayjs from 'dayjs';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAttendanceToday(userId: string): Promise<AttendanceEntity | null> {
    const today = dayjs();
    const startOfDay = today.startOf('day').toDate();
    const endOfDay = today.endOf('day').toDate();

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return attendance ? new AttendanceEntity(attendance) : null;
  }

  async createOrUpdateAttendance(userId: string): Promise<AttendanceEntity> {
    const today = dayjs();
    const startOfDay = today.startOf('day').toDate();
    const endOfDay = today.endOf('day').toDate();
    const now = today.toDate();

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Check if attendance exists for today
        let attendance = await tx.attendance.findFirst({
          where: {
            userId,
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        });

        if (!attendance) {
          // Create new attendance with tap_in
          attendance = await tx.attendance.create({
            data: {
              userId,
              tapIn: now,
            },
          });
        } else {
          // Check if already completed
          if (attendance.tapIn && attendance.tapOut) {
            throw new HttpException(
              'Already completed attendance today',
              HttpStatus.BAD_REQUEST,
            );
          }

          // Update tap_out
          attendance = await tx.attendance.update({
            where: { id: attendance.id },
            data: { tapOut: now },
          });
        }

        return new AttendanceEntity(attendance);
      });
    } catch (error) {
      console.error('Error creating/updating attendance:', error);
      
      // Check if it's a foreign key constraint error
      if (error.code === 'P2003') {
        throw new BadRequestException(`User with ID ${userId} does not exist`);
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  async getAttendancesByUser(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<AttendanceEntity[]> {
    const where: any = { userId };

    if (startDate && endDate) {
      where.createdAt = {
        gte: dayjs(startDate).startOf('day').toDate(),
        lte: dayjs(endDate).endOf('day').toDate(),
      };
    }

    const attendances = await this.prisma.attendance.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return attendances.map((attendance) => new AttendanceEntity(attendance));
  }

  async getDashboard(
    month: number,
    year: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    month: number;
    year: number;
    total_users: number;
    days_in_month: number;
    current_page: number;
    total_page: number;
    data: any[];
  }> {
    // Validate month and year
    if (month < 1 || month > 12) {
      throw new BadRequestException('Month must be between 1 and 12');
    }
    if (year < 2000) {
      throw new BadRequestException('Year must be >= 2000');
    }

    // Construct date range using dayjs
    const startOfMonth = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const endOfMonth = dayjs(`${year}-${month}-01`).endOf('month').toDate();
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

    // Fetch users with pagination (simulated pagination for now)
    // In a real implementation, you would have a User model/service
    const allUsers = await this.prisma.attendance.groupBy({
      by: ['userId'],
      _count: {
        userId: true,
      },
    });

    const totalUsers = allUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const offset = (page - 1) * limit;
    const usersForPage = allUsers.slice(offset, offset + limit);

    // Fetch all attendances within the month
    const attendances = await this.prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group attendances by user_id for O(n) performance
    const attendanceMap = new Map<string, AttendanceEntity[]>();
    attendances.forEach((attendance) => {
      const entity = new AttendanceEntity(attendance);
      if (!attendanceMap.has(entity.userId)) {
        attendanceMap.set(entity.userId, []);
      }
      attendanceMap.get(entity.userId)!.push(entity);
    });

    // Generate dynamic columns from 1 until daysInMonth
    const data = usersForPage.map((userGroup) => {
      const userId = userGroup.userId;
      const userAttendances = attendanceMap.get(userId) || [];
      
      // Initialize row with default values
      const row: any = {
        id: userId,
        name: `User ${userId}`, // In real implementation, fetch actual user name
        total_present: 0,
        total_completed: 0,
        total_tap_in_only: 0,
        total_absent: 0,
      };

      // Generate daily columns
      for (let day = 1; day <= daysInMonth; day++) {
        row[day.toString()] = 'ABSENT';
      }

      // Process attendances for this user
      userAttendances.forEach((attendance) => {
        const day = dayjs(attendance.createdAt).date().toString();
        
        if (attendance.tapIn && attendance.tapOut) {
          row[day] = 'COMPLETED';
          row.total_completed++;
          row.total_present++;
        } else if (attendance.tapIn && !attendance.tapOut) {
          row[day] = 'TAP_IN_ONLY';
          row.total_tap_in_only++;
          row.total_present++;
        }
      });

      // Calculate total_absent
      row.total_absent = daysInMonth - row.total_present;

      return row;
    });

    return {
      month,
      year,
      total_users: totalUsers,
      days_in_month: daysInMonth,
      current_page: page,
      total_page: totalPages,
      data,
    };
  }
}