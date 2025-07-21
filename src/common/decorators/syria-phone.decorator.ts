// File: syria-phone.decorator.ts
import { applyDecorators, BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

interface SyriaPhoneOptions {
  /**
   * Auto-format international numbers to local format
   * Example: +963968381624 → 0968381624
   * @default false
   */
  formatToLocal?: boolean;

  /**
   * Auto-format local numbers to international format
   * Example: 0968381624 → +963968381624
   * @default false
   */
  formatToInternational?: boolean;
}

export function SyriaPhone(options?: SyriaPhoneOptions) {
  return applyDecorators(
    Transform(({ key, obj }) => {
      const value = obj[key];

      if (value === undefined || value === null || value === '') {
        return undefined;
      }

      const phoneNumber = String(value);

      // Validate input - only allow 0123456789+
      if (!/^[0123456789+]+$/.test(phoneNumber)) {
        throw new BadRequestException(
          `Invalid characters in ${key}. Phone number can only contain digits (0-9) and plus (+) sign.`,
        );
      }

      let validatedNumber = phoneNumber;

      // Format to local (remove +963 and add 0)
      if (options?.formatToLocal && phoneNumber.startsWith('+963')) {
        validatedNumber = '0' + phoneNumber.substring(4);
      }

      // Format to international (remove leading 0 and add +963)
      if (options?.formatToInternational && phoneNumber.startsWith('0')) {
        validatedNumber = '+963' + phoneNumber.substring(1);
      }

      // Validate Syria phone number format
      const isLocalFormat = /^09[0-9]{8}$/.test(validatedNumber);
      const isInternationalFormat = /^\+9639[0-9]{8}$/.test(validatedNumber);

      if (!isLocalFormat && !isInternationalFormat) {
        throw new BadRequestException(
          `Invalid Syria phone number format for ${key}. Use: 09XXXXXXXX or +9639XXXXXXXX`,
        );
      }

      return validatedNumber;
    }),
    IsString(),
  );
}
