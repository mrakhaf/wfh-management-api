import { Controller, Get, Post, Query, Param, Body, UseInterceptors, UseFilters, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceResponseDto } from './dto/attendance-response.dto';
import { DashboardResponseDto } from './dto/dashboard-response.dto';
import { DashboardQueryDto } from './dto/dashboard-query.dto';
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { HrdDashboardGuard } from '../../common/guards/hrd-dashboard.guard';

@Controller('attendance')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  async getAttendanceToday(@Query('user_id') userId: string): Promise<AttendanceResponseDto | null> {
    const attendance = await this.attendanceService.getAttendanceToday(userId);
    return attendance ? new AttendanceResponseDto(attendance) : null;
  }

  @Post('absence')
  async createOrUpdateAttendance(@Body() createAttendanceDto: CreateAttendanceDto): Promise<AttendanceResponseDto> {
    const attendance = await this.attendanceService.createOrUpdateAttendance(createAttendanceDto.user_id);
    return new AttendanceResponseDto(attendance);
  }

  @Get('user/:user_id')
  async getAttendancesByUser(
    @Param('user_id') userId: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ): Promise<AttendanceResponseDto[]> {
    const attendances = await this.attendanceService.getAttendancesByUser(userId, startDate, endDate);
    return attendances.map((attendance) => new AttendanceResponseDto(attendance));
  }

  @Get('dashboard')
  @UseGuards(HrdDashboardGuard)
  @ApiTags('Attendance')
  @ApiQuery({ name: 'month', type: Number, description: 'Month (1-12)', example: 2 })
  @ApiQuery({ name: 'year', type: Number, description: 'Year (e.g. 2026)', example: 2026 })
  @ApiQuery({ name: 'page', type: Number, description: 'Page number', example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, description: 'Limit per page', example: 10, required: false })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: DashboardResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid month or year parameters'
  })
  async getDashboard(
    @Query() query: DashboardQueryDto,
  ): Promise<DashboardResponseDto> {
    const dashboardData = await this.attendanceService.getDashboard(
      query.month,
      query.year,
      query.page,
      query.limit
    );
    return new DashboardResponseDto(dashboardData);
  }
}