import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/db/prisma.service";
import IResult from "./Result.entity";

@Injectable()
export class ResultRepository {
    constructor(private prismaService: PrismaService) { }

    async create(result: IResult) {
        return this.prismaService.result.create({
            data: result
        })
    }

    async update(result: IResult) {
        return this.prismaService.result.update({
            where: {
                id: result.id
            },
            data: result
        })
    }

    async delete(id: number) {
        return this.prismaService.result.delete({
            where: {
                id
            }
        })
    }




}  