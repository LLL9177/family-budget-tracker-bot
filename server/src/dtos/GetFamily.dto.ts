import { IsUUID } from "class-validator";

export class GetFamilyDto {
    @IsUUID()
    id: string;
}