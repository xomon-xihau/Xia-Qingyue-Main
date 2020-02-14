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

const data = require('../../utils/atgp');
const colors = require('../../utils/colors');

class AtgpCommand extends Command {
  constructor() {
    super('atgp', {
      aliases: ['atgp', 'ap'],
      args: [
        {
          id: 'ap',
          type: 'lowercase',
          prompt: {
            start: 'Pic name?',
          },
        },
        {
          id: 'num',
          type: 'number',
          default: null,
        },
      ],
      category: 'atg',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
      description: {
        content: 'ATG offical pics.',
        usage: '<x>',
        examples: ['xq'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, { ap, num }) {
    let randomItem = false;
    if (typeof data[ap] !== 'undefined') {
      const myArray = data[ap];
      if (num > 0 && num <= myArray.length) {
        randomItem = myArray[Math.floor(num) - 1];
      }
      if (!randomItem) {
        randomItem = myArray[Math.floor(Math.random() * myArray.length)];
      }
      return message.util.send({ files: [randomItem] });
    }
    const embed = new MessageEmbed();
    embed.setColor(colors.mediumvioletred)
      .setDescription('**Not Found!**')
      .addField('❯ Available Pics', Object.keys(data).join('・'));
    return message.util.send(embed)
      .then(msg => msg.delete({ timeout: 20000, reason: 'It had to be done.' }));
  }
}

module.exports = AtgpCommand;
