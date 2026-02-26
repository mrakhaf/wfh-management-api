import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class DashboardQueryDto {
  @ApiProperty({ 
    description: 'Month (1-12)', 
    example: 2,
    minimum: 1,
    maximum: 12
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ 
    description: 'Year (e.g. 2026)', 
    example: 2026,
    minimum: 2000
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  @Min(2000)
  year: number;

  @ApiProperty({ 
    description: 'Page number', 
    example: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  page?: number = 1;

  @ApiProperty({ 
    description: 'Limit per page', 
    example: 10,
    default: 10,
    required: false
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsPositive()
  limit?: number = 10;
}
