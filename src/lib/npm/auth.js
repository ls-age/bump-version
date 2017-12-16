import run from '../run';

export function whoAmI({ cwd }) {
  return run('npm', ['whoami'], { cwd });
}

export default function loggedIn(options) {
  return whoAmI(options)
    .then(() => true)
    .catch(() => false);
}
