/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import os from 'os';
import * as docblock from '..';

describe('docblock', () => {
  it('extracts valid docblock with line comment', () => {
    const code =
      '/**' +
      os.EOL +
      ' * @providesModule foo' +
      os.EOL +
      '* // TODO: test' +
      os.EOL +
      '*/' +
      os.EOL +
      'const x = foo;';
    expect(docblock.extract(code)).toBe(
      '/**' +
        os.EOL +
        ' * @providesModule foo' +
        os.EOL +
        '* // TODO: test' +
        os.EOL +
        '*/',
    );
  });

  it('extracts valid docblock', () => {
    const code =
      '/**' +
      os.EOL +
      ' * @providesModule foo' +
      os.EOL +
      '*/' +
      os.EOL +
      'const x = foo;';
    expect(docblock.extract(code)).toBe(
      '/**' + os.EOL + ' * @providesModule foo' + os.EOL + '*/',
    );
  });

  it('extracts valid docblock with more comments', () => {
    const code =
      '/**' +
      os.EOL +
      ' * @providesModule foo' +
      os.EOL +
      '*/' +
      os.EOL +
      'const x = foo;' +
      os.EOL +
      '/**foo*/';
    expect(docblock.extract(code)).toBe(
      '/**' + os.EOL + ' * @providesModule foo' + os.EOL + '*/',
    );
  });

  it('extracts from invalid docblock', () => {
    const code =
      '/*' +
      os.EOL +
      ' * @providesModule foo' +
      os.EOL +
      '*/' +
      os.EOL +
      'const x = foo;';
    expect(docblock.extract(code)).toBe(
      '/*' + os.EOL + ' * @providesModule foo' + os.EOL + '*/',
    );
  });

  it('returns extract and parsedocblock', () => {
    const code =
      '/** @provides module-name */' +
      os.EOL +
      '' +
      '' +
      os.EOL +
      '' +
      '.dummy {}' +
      os.EOL +
      '';

    expect(docblock.parse(docblock.extract(code))).toEqual({
      provides: 'module-name',
    });
  });

  it('parses directives out of a docblock', () => {
    const code =
      '/**' +
      os.EOL +
      '' +
      ' * @providesModule foo' +
      os.EOL +
      '' +
      ' * @css a b' +
      os.EOL +
      '' +
      ' * @preserve-whitespace' +
      os.EOL +
      '' +
      ' */';
    expect(docblock.parse(code)).toEqual({
      css: 'a b',
      'preserve-whitespace': '',
      providesModule: 'foo',
    });
  });

  it('parses directives out of a docblock with comments', () => {
    const code =
      '/**' +
      os.EOL +
      '' +
      ' * Copyright 2004-present Facebook. All Rights Reserved.' +
      os.EOL +
      '' +
      ' * @providesModule foo' +
      os.EOL +
      '' +
      ' * @css a b' +
      os.EOL +
      '' +
      ' *' +
      os.EOL +
      '' +
      ' * And some license here' +
      os.EOL +
      '' +
      ' * @preserve-whitespace' +
      os.EOL +
      '' +
      ' */';
    expect(docblock.parse(code)).toEqual({
      css: 'a b',
      'preserve-whitespace': '',
      providesModule: 'foo',
    });
  });

  it('parses directives out of a docblock with line comments', () => {
    const code =
      '/**' +
      os.EOL +
      '' +
      ' * @providesModule foo' +
      os.EOL +
      '' +
      ' * // TODO: test' +
      os.EOL +
      '' +
      ' */';
    expect(docblock.parse(code)).toEqual({
      providesModule: 'foo',
    });
  });

  it('parses multiline directives', () => {
    const code =
      '/**' +
      os.EOL +
      '' +
      ' * Copyright 2004-present Facebook. All Rights Reserved.' +
      os.EOL +
      '' +
      ' * @class A long declaration of a class' +
      os.EOL +
      '' +
      ' *        goes here, so we can read it and enjoy' +
      os.EOL +
      '' +
      ' *' +
      os.EOL +
      '' +
      ' * And some license here' +
      os.EOL +
      '' +
      ' * @preserve-whitespace' +
      os.EOL +
      '' +
      ' */';
    expect(docblock.parse(code)).toEqual({
      class:
        'A long declaration of a class goes here, ' +
        'so we can read it and enjoy',
      'preserve-whitespace': '',
    });
  });

  it('supports slashes in @providesModule directive', () => {
    const code =
      '/**' +
      os.EOL +
      '' +
      ' * @providesModule apple/banana' +
      os.EOL +
      '' +
      ' */';
    expect(docblock.parse(code)).toEqual({
      providesModule: 'apple/banana',
    });
  });

  it('extracts comments from docblock', () => {
    const code =
      '/**' +
      os.EOL +
      ' * hello world' +
      os.EOL +
      ' * @flow yes' +
      os.EOL +
      ' */';
    expect(docblock.parseWithComments(code)).toEqual({
      comments: 'hello world',
      pragmas: {flow: 'yes'},
    });
  });

  it('extracts multiline comments from docblock', () => {
    const code =
      '/**' +
      os.EOL +
      ' * hello' +
      os.EOL +
      ' * world' +
      os.EOL +
      ' * @flow yes' +
      os.EOL +
      ' */';
    expect(docblock.parseWithComments(code)).toEqual({
      comments: 'hello' + os.EOL + 'world',
      pragmas: {flow: 'yes'},
    });
  });

  it('extracts comments from beginning and end of docblock', () => {
    const code =
      '/**' +
      os.EOL +
      ' * hello' +
      os.EOL +
      ' * @flow yes' +
      os.EOL +
      ' * ' +
      os.EOL +
      ' * @format' +
      os.EOL +
      ' * ' +
      os.EOL +
      ' * world' +
      os.EOL +
      ' */';
    expect(docblock.parseWithComments(code)).toEqual({
      comments: 'hello' + os.EOL + 'world',
      pragmas: {flow: 'yes', format: ''},
    });
  });

  it('extracts comments from end of docblock', () => {
    const code =
      '/**' +
      os.EOL +
      ' * @flow yes' +
      os.EOL +
      ' * @format' +
      os.EOL +
      ' * ' +
      os.EOL +
      ' * hello world' +
      os.EOL +
      ' */';
    expect(docblock.parseWithComments(code)).toEqual({
      comments: 'hello world',
      pragmas: {flow: 'yes', format: ''},
    });
  });

  it('extracts docblock comments as CRLF when docblock contains CRLF', () => {
    const code = '/**\r\n * foo\r\n * bar\r\n*/';
    expect(docblock.parseWithComments(code)).toEqual({
      comments: 'foo\r\nbar',
      pragmas: {},
    });
  });

  it('extracts docblock comments as LF when docblock contains LF', () => {
    const code = '/**\n * foo\n * bar\n*/';
    expect(docblock.parseWithComments(code)).toEqual({
      comments: 'foo\nbar',
      pragmas: {},
    });
  });

  it('prints docblocks with no pragmas as empty string', () => {
    const pragmas = {};
    expect(docblock.print({pragmas})).toEqual('');
  });

  it('prints docblocks with one pragma on one line', () => {
    const pragmas = {flow: ''};
    expect(docblock.print({pragmas})).toEqual('/** @flow */');
  });

  it('prints docblocks with multiple pragmas on multiple lines', () => {
    const pragmas = {
      flow: '',
      format: '',
    };
    expect(docblock.print({pragmas})).toEqual(
      '/**' + os.EOL + ' * @flow' + os.EOL + ' * @format' + os.EOL + ' */',
    );
  });

  it('prints docblocks with pragmas', () => {
    const pragmas = {
      flow: 'foo',
      providesModule: 'x/y/z',
    };
    expect(docblock.print({pragmas})).toEqual(
      '/**' +
        os.EOL +
        ' * @flow foo' +
        os.EOL +
        ' * @providesModule x/y/z' +
        os.EOL +
        ' */',
    );
  });

  it('prints docblocks with comments', () => {
    const pragmas = {flow: 'foo'};
    const comments = 'hello';
    expect(docblock.print({comments, pragmas})).toEqual(
      '/**' +
        os.EOL +
        ' * hello' +
        os.EOL +
        ' *' +
        os.EOL +
        ' * @flow foo' +
        os.EOL +
        ' */',
    );
  });

  it('prints docblocks with comments and no keys', () => {
    const pragmas = {};
    const comments = 'Copyright 2004-present Facebook. All Rights Reserved.';
    expect(docblock.print({comments, pragmas})).toEqual(
      '/**' + os.EOL + ' * ' + comments + os.EOL + ' */',
    );
  });

  it('prints docblocks with multiline comments', () => {
    const pragmas = {};
    const comments = 'hello' + os.EOL + 'world';
    expect(docblock.print({comments, pragmas})).toEqual(
      '/**' + os.EOL + ' * hello' + os.EOL + ' * world' + os.EOL + ' */',
    );
  });

  it('prints docblocks that are parseable', () => {
    const pragmas = {a: 'b', c: ''};
    const comments = 'hello world!';
    const formatted = docblock.print({comments, pragmas});
    const parsed = docblock.parse(formatted);
    expect(parsed).toEqual(pragmas);
  });

  it('can augment existing docblocks with comments', () => {
    const before =
      '/**' + os.EOL + ' * Legalese' + os.EOL + ' * @flow' + os.EOL + ' */';
    const {comments, pragmas} = docblock.parseWithComments(before);
    pragmas.format = '';
    const after = docblock.print({comments, pragmas});
    expect(after).toEqual(
      '/**' +
        os.EOL +
        ' * Legalese' +
        os.EOL +
        ' *' +
        os.EOL +
        ' * @flow' +
        os.EOL +
        ' * @format' +
        os.EOL +
        ' */',
    );
  });

  it('prints docblocks using CRLF if comments contains CRLF', () => {
    const pragmas = {};
    const comments = 'hello\r\nworld';
    const formatted = docblock.print({comments, pragmas});
    expect(formatted).toEqual('/**\r\n * hello\r\n * world\r\n */');
  });

  it('prints docblocks using LF if comments contains LF', () => {
    const pragmas = {};
    const comments = 'hello\nworld';
    const formatted = docblock.print({comments, pragmas});
    expect(formatted).toEqual('/**\n * hello\n * world\n */');
  });
});
