import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MaxLength(200)
  description: string;
}