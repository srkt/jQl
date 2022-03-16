const resetCache = require('resnap')();
const flush = require('flush-cache');

import { expect } from 'chai';
import { CommonKeys, IExtractor } from '../src/IExtractor';
import { From, JqlOptions } from '../src/jQl';
import { Student, User } from '../src/User';
import { clients, IClient } from './clients';
import { TestJqlOptions } from './httpMok';
import { users } from './users';

var assert = require('assert');
var chai = require('chai');

beforeEach(flush);

describe('jQl', function () {
  it('jQl Test', async function () {
    const men = await From(users, TestJqlOptions)
      .Where((s) => '1,2,3,4'.includes(s.id))
      .JoinAsync<IClient>(
        'clients',
        (u, c) => u.id === c.id && u.first_name === c.first_name
      );
    men.GroupByTest([(t) => t.id, (t) => t.email]);
    const data = men.Select(
      'first_name',
      'last_name',
      'email',
      'gender'
    ).Result;
    console.log(data);
    expect(men).not.undefined;
  });
});

interface ISample<T> {
  GroupBySample<T>(
    aggregateColumns: ((k: T) => any)[],
    keys?: (keyof T)[]
  ): any;
}

// (function () {
//   debugger;
//   const men = From(users)
//     .Where((s) => '1,2,3,4'.includes(s.id))
//     .Join(clients, (u, c) => u.id === c.id && u.first_name === c.first_name)
//     .Select('first_name', 'last_name', 'email', 'gender');
//   console.log(men);
// })();
