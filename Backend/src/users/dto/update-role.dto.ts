import { IsNotEmpty, IsUUID } from "class-validator";

export class UserRoleUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    roleId: string;
}