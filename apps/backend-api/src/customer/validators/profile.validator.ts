import { SkinProfileDto, SkinTypeEnum } from '../dto/skin-profile.dto';

export function validateSkinProfileData(dto: SkinProfileDto): void {
  if (!Object.values(SkinTypeEnum).includes(dto.skinType)) {
    throw new Error(`Invalid skin type '${dto.skinType}'. Allowed values: ${Object.values(SkinTypeEnum).join(', ')}`);
  }

  if (dto.concerns && !Array.isArray(dto.concerns)) {
    throw new Error('Skin concerns must be an array of string values');
  }
}
