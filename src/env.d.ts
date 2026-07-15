/// <reference path="../.astro/types.d.ts" />

import type { SessionAdmin } from './server/auth';

declare global {
  namespace App {
    interface Locals {
      /** Administrateur connecté (renseigné par le middleware), ou null. */
      admin: SessionAdmin | null;
    }
  }
}
