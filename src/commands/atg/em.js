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

const emote = require('../../utils/emote');
const colors = require('../../utils/colors');

class EmoteCommand extends Command {
  constructor() {
    super('emote', {
      aliases: ['emote', 'em'],
      args: [
        {
          id: 'em',
          type: 'text',
          prompt: {
            start: 'Emote name?',
          },
        },
      ],
      category: 'atg',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS', 'ATTACH_FILES'],
      description: {
        content: 'Emotes.',
        usage: '<x>',
        examples: ['xqbestgirl'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, args) {
    if (typeof emote[args.em] !== 'undefined') {
      return message.util.send({ files: [emote[args.em]] });
    }
    const embed = new MessageEmbed();
    embed.setColor(colors.mediumvioletred)
      .setDescription('**Not Found!**')
      .addField('❯ Available Emotes', Object.keys(emote).join('・'));
    return message.util.send(embed)
      .then(msg => msg.delete({ timeout: 20000, reason: 'It had to be done.' }));
  }
}

module.exports = EmoteCommand;
