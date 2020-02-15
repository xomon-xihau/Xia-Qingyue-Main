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

const myArray = ['Yes', 'No'];
const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

class YesOrNoCommand extends Command {
  constructor() {
    super('yesorno', {
      aliases: ['yesorno', 'yn'],
      args: [
        {
          id: 'yn',
          type: 'text',
          match: 'content',
          prompt: {
            start: 'What you want to ask?',
          },
        },
      ],
      category: 'fun',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Get reply in yes or no.',
        usage: '<x>',
        examples: ['xq is best girl?'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, args) {
    let qs = args.yn;
    if (qs.match(/^[a-z]/)) qs = capitalize(qs);
    if (qs.slice(-1) !== '?') qs = `${qs}?`;
    const ans = myArray[Math.floor(Math.random() * myArray.length)];
    const embed = new MessageEmbed()
      .setColor(colors.darkviolet)
      .setAuthor(qs, message.author.avatarURL())
      .setFooter(ans, this.client.user.displayAvatarURL());
    return message.util.send(embed);
  }
}

module.exports = YesOrNoCommand;
