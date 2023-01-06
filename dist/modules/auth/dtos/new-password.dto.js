"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewPasswordDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class NewPasswordDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email that is changing password. It should be a valid email.',
        example: 'gui.sartori96@gmail.com',
        required: true,
    }),
    __metadata("design:type", String)
], NewPasswordDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'New password. Password should have at least 1 uppercase character, 1 lowercase character, 1 number, 1 special character and the minimum is 8 characters.',
        example: 'Gu1lh3rm3#',
        required: true,
    }),
    __metadata("design:type", String)
], NewPasswordDTO.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'This field should be equal to "password" field.',
        example: 'Gu1lh3rm3#',
        required: true,
    }),
    __metadata("design:type", String)
], NewPasswordDTO.prototype, "passwordConfirmation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Protocol is the hash sent via email to user change his password.',
        example: 'nsau97y029ejo2neas6d5as9d210',
        required: true,
    }),
    __metadata("design:type", String)
], NewPasswordDTO.prototype, "_protocol", void 0);
exports.NewPasswordDTO = NewPasswordDTO;
//# sourceMappingURL=new-password.dto.js.map