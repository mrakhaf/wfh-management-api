import { ApiProperty } from '@nestjs/swagger';
import { AttendanceEntity } from '../entities/attendance.entity';

export class AttendanceResponseDto {
  @ApiProperty({ description: 'Attendance ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Tap in time', nullable: true })
  tapIn: Date | null;

  @ApiProperty({ description: 'Tap out time', nullable: true })
  tapOut: Date | null;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;

  constructor(entity: AttendanceEntity) {
    this.id = entity.id;
    this.userId = entity.userId;
    this.tapIn = entity.tapIn;
    this.tapOut = entity.tapOut;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
