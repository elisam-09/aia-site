import type { APIRoute } from 'astro';
import { logout } from '../../server/auth';

export const POST: APIRoute = ({ cookies, redirect }) => {
  logout(cookies);
  return redirect('/admin/login');
};

// Un accès direct en GET renvoie simplement vers la connexion
export const GET: APIRoute = ({ redirect }) => redirect('/admin/login');
