import { IsArray, IsOptional, IsString } from 'class-validator';

export class CheckAliveDto {
  @IsArray()
  @IsString({ each: true })
  hosts: string[];
}
