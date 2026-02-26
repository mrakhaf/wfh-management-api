export class AttendanceEntity {
  id: string;
  userId: string;
  tapIn: Date | null;
  tapOut: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AttendanceEntity>) {
    Object.assign(this, partial);
  }
}
