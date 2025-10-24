import {
    Controller,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { PassportJwtAuthGuard } from '../guards/passport-jwt.guard';


@ApiTags('Student Profile')
@Controller('v1/student-profile')
export class StudentProfileController {

    @UseGuards(PassportJwtAuthGuard)
    @Get('/me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get currently logged-in student info' })
    @ApiResponse({
        status: 200,
        description: 'Returns student info from verified JWT token',
        schema: {
            example: {
                id: 'c12b6e14-9ac5-4c99-8a2a-b8e2fdaf7e7a',
                email: 'adeola@gmail.com',
                firstName: 'Adeola',
                lastName: 'Solape',
                role: 'student',
            },
        },
    })
    async getProfile(@Req() req: any) {
        return req.user;
        
    }
}
