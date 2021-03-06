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

const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

const colors = require('../../utils/colors');

class TimeCommand extends Command {
  constructor() {
    super('time', {
      aliases: ['time', 'mtime'],
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Show the Shanghai time.',
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message) {
    const date = new Date();
    const time = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Shanghai' });
    const embed = new MessageEmbed()
      .setColor(colors.darkviolet)
      .setDescription(`**Shanghai Time:** ${time}`);
    return message.util.send(embed);
  }
}

module.exports = TimeCommand;
