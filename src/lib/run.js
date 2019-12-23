import exec from 'execa';

export default function run(command, args, options) {
  return exec(command, args, options).catch(err => {
    Object.assign(err, {
      message: `Running '${command} ${args.join(' ')}' failed: ${err.message}`,
    });

    throw err;
  });
}
