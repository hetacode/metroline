import { canExecWhenBranch } from './can-exec-when-branch';
import { canExecWhenTag } from './can-exec-when-tag';
import { canExecWhenPath } from './can-exec-when-path';

describe('canExecWhenBranch', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('simple array', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenBranch('master', undefined);
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenBranch('master', []);
      expect(filter).toEqual(true);
    });

    it('should be true no pattern patch', async () => {
      const filter = canExecWhenBranch('master', ['dev']);
      expect(filter).toEqual(false);
    });

    it('should be false when some pattern matches', async () => {
      const filter = canExecWhenBranch('master', ['mas.*']);
      expect(filter).toEqual(true);
    });
  });

  describe('include', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenBranch('master', { include: undefined });
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenBranch('master', { include: [] });
      expect(filter).toEqual(true);
    });

    it('should be true no pattern patch', async () => {
      const filter = canExecWhenBranch('master', { include: ['dev'] });
      expect(filter).toEqual(false);
    });

    it('should be false when some pattern matches', async () => {
      const filter = canExecWhenBranch('master', { include: ['mas.*'] });
      expect(filter).toEqual(true);
    });
  });

  describe('exclude', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenBranch('master', { exclude: undefined });
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenBranch('master', { exclude: [] });
      expect(filter).toEqual(true);
    });

    it('should be true no pattern patch', async () => {
      const filter = canExecWhenBranch('master', { exclude: ['dev'] });
      expect(filter).toEqual(true);
    });

    it('should be false when some pattern matches', async () => {
      const filter = canExecWhenBranch('master', { exclude: ['mas.*'] });
      expect(filter).toEqual(false);
    });
  });
});

describe('canExecWhenTag', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('simple array', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenTag('build-1', undefined);
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenTag('build-1', []);
      expect(filter).toEqual(true);
    });

    it('should be false no pattern patch', async () => {
      const filter = canExecWhenTag('build-1', ['release']);
      expect(filter).toEqual(false);
    });

    it('should be false when looking for exactly name', async () => {
      const filter = canExecWhenTag('build-1', ['^build$']);
      expect(filter).toEqual(false);
    });

    it('should be true when some pattern matches', async () => {
      const filter = canExecWhenTag('build-1', ['build.*']);
      expect(filter).toEqual(true);
    });
  });

  describe('include', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenTag('build-1', { include: undefined });
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenTag('build-1', { include: [] });
      expect(filter).toEqual(true);
    });

    it('should be false no pattern patch', async () => {
      const filter = canExecWhenTag('build-1', { include: ['release'] });
      expect(filter).toEqual(false);
    });

    it('should be false when looking for exactly name', async () => {
      const filter = canExecWhenTag('build-1', { include: ['^build$'] });
      expect(filter).toEqual(false);
    });

    it('should be true when some pattern matches', async () => {
      const filter = canExecWhenTag('build-1', { include: ['build.*'] });
      expect(filter).toEqual(true);
    });
  });

  describe('exclude', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenTag('build-1', { exclude: undefined });
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenTag('build-1', { exclude: [] });
      expect(filter).toEqual(true);
    });

    it('should be true no pattern patch', async () => {
      const filter = canExecWhenTag('build-1', { exclude: ['relase'] });
      expect(filter).toEqual(true);
    });

    it('should be true when looking for exactly name', async () => {
      const filter = canExecWhenTag('build-1', { exclude: ['^build$'] });
      expect(filter).toEqual(true);
    });

    it('should be false when some pattern matches', async () => {
      const filter = canExecWhenTag('build-1', { exclude: ['build.*'] });
      expect(filter).toEqual(false);
    });
  });
});

describe('canExecWhenPath', () => {
  afterEach(() => jest.restoreAllMocks());

  describe('simple array', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenPath(['main.go'], undefined);
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenPath(['main.go'], []);
      expect(filter).toEqual(true);
    });

    it('should be false no pattern patch', async () => {
      const filter = canExecWhenPath(['doc/readme.md'], ['app\/.*']);
      expect(filter).toEqual(false);
    });

    it('should be false when looking for exactly file pathj', async () => {
      const filter = canExecWhenPath(['doc/readme.md'], ['^app\/main.go$']);
      expect(filter).toEqual(false);
    });

    it('should be true when some pattern matches', async () => {
      const filter = canExecWhenPath(['doc/readme.md', 'app/main.go'], ['^app\/.*']);
      expect(filter).toEqual(true);
    });

    it('should be true when some pattern matches', async () => {
      const filter = canExecWhenPath(['doc/readme.md', 'main.go'], ['^app\/.*', '^doc\/.*']);
      expect(filter).toEqual(true);
    });
  });

  describe('include', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenPath(['main.go'], { include: undefined });
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenPath(['main.go'], { include: [] });
      expect(filter).toEqual(true);
    });

    it('should be false no pattern patch', async () => {
      const filter = canExecWhenPath(['doc/readme.md'], { include: ['app\/.*'] });
      expect(filter).toEqual(false);
    });

    it('should be false when looking for exactly file pathj', async () => {
      const filter = canExecWhenPath(['doc/readme.md'], { include: ['^app\/main.go$'] });
      expect(filter).toEqual(false);
    });

    it('should be true when some pattern matches', async () => {
      const filter = canExecWhenPath(['doc/readme.md', 'app/main.go'], { include: ['^app\/.*'] });
      expect(filter).toEqual(true);
    });

    it('should be true when some pattern matches', async () => {
      const filter = canExecWhenPath(['doc/readme.md', 'main.go'], { include: ['^app\/.*', '^doc\/.*'] });
      expect(filter).toEqual(true);
    });
  });

  describe('exclude', () => {
    it('should be true when array is not defined', async () => {
      const filter = canExecWhenPath(['main.go'], { exclude: undefined });
      expect(filter).toEqual(true);
    });

    it('should be true when array is empty', async () => {
      const filter = canExecWhenPath(['main.go'], { exclude: [] });
      expect(filter).toEqual(true);
    });

    it('should be true no pattern patch', async () => {
      const filter = canExecWhenPath(['doc/readme.md'], { exclude: ['app\/.*'] });
      expect(filter).toEqual(true);
    });

    it('should be true when looking for exactly file pathj', async () => {
      const filter = canExecWhenPath(['doc/readme.md'], { exclude: ['^app\/main.go$'] });
      expect(filter).toEqual(true);
    });

    it('should be false when some pattern matches', async () => {
      const filter = canExecWhenPath(['doc/readme.md', 'app/main.go'], { exclude: ['^app\/.*'] });
      expect(filter).toEqual(false);
    });

    it('should be false when some pattern matches', async () => {
      const filter = canExecWhenPath(['doc/readme.md', 'main.go'], { exclude: ['^app\/.*', '^doc\/.*'] });
      expect(filter).toEqual(false);
    });
  });
});
