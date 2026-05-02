import { IsNotEmpty, IsUUID } from "class-validator";

export class UserStatusUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    statusId: string;
}