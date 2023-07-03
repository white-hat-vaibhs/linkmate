export { matchers } from './client-matchers.js';

export const nodes = [() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14')];

export const server_loads = [0,2];

export const dictionary = {
	"/": [~3],
	"/login": [~4],
	"/my/projects": [~5],
	"/my/settings": [~6,[2]],
	"/my/settings/account": [~7,[2]],
	"/my/settings/profile": [~8,[2]],
	"/my/settings/security": [~9,[2]],
	"/projects/new": [~12],
	"/projects/[projectId]": [~10],
	"/projects/[projectId]/edit": [~11],
	"/register": [~13],
	"/reset-password": [~14]
};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};