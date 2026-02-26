import { IsUUID, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsUUID()
  user_id: string;

  @IsOptional()
  tapIn?: Date;

  @IsOptional()
  tapOut?: Date;
}
