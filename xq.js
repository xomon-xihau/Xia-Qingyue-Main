'use strict';
/*
 * This file is a part of xia qingyue project.
 * Copyright (C) 2020  Xomon Xihau
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const XiaQingyue = require('./src/XiaQingyue');
const { config } = require('dotenv');

config({
  path: `${__dirname}/.env`,
});

const xq = new XiaQingyue();

xq.login(process.env.TOKEN);
xq.on('error', e => console.error(e));
xq.on('warn', e => console.warn(e));
xq.on('debug', e => console.error(e));

process.on('unhandledRejection', err => console.error(err));
