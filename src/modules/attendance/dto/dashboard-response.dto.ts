import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({ description: 'Month (1-12)' })
  month: number;

  @ApiProperty({ description: 'Year (e.g. 2026)' })
  year: number;

  @ApiProperty({ description: 'Total users' })
  total_users: number;

  @ApiProperty({ description: 'Days in month' })
  days_in_month: number;

  @ApiProperty({ description: 'Current page' })
  current_page: number;

  @ApiProperty({ description: 'Total pages' })
  total_page: number;

  @ApiProperty({ 
    description: 'Monthly pivot table data per user',
    example: [
      {
        id: "user-123",
        name: "John Doe",
        total_present: 20,
        total_completed: 18,
        total_tap_in_only: 2,
        total_absent: 8,
        "1": "COMPLETED",
        "2": "TAP_IN_ONLY",
        "3": "ABSENT",
        // ... days 4-28
        "28": "COMPLETED"
      }
    ]
  })
  data: DashboardUserRow[];

  constructor(data: {
    month: number;
    year: number;
    total_users: number;
    days_in_month: number;
    current_page: number;
    total_page: number;
    data: DashboardUserRow[];
  }) {
    this.month = data.month;
    this.year = data.year;
    this.total_users = data.total_users;
    this.days_in_month = data.days_in_month;
    this.current_page = data.current_page;
    this.total_page = data.total_page;
    this.data = data.data;
  }
}

export class DashboardUserRow {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'Total present days' })
  total_present: number;

  @ApiProperty({ description: 'Total completed days (tap in + tap out)' })
  total_completed: number;

  @ApiProperty({ description: 'Total tap in only days' })
  total_tap_in_only: number;

  @ApiProperty({ description: 'Total absent days' })
  total_absent: number;

  // Dynamic properties for daily attendance status (1, 2, 3, etc.)
  [key: string]: string | number;
}
