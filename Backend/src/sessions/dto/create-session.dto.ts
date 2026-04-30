import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  @IsNotEmpty()
  idUser: string;

  @IsString()
  @IsNotEmpty()
  sessionToken: string;

  @IsString()
  @IsOptional()
  ipOrigin?: string;

  @IsString()
  @IsOptional()
  device?: string;
}