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

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const colors = require('../../utils/colors');

class AbbreviationCommand extends Command {
  constructor() {
    super('abbreviation', {
      aliases: ['abbreviation', 'ab'],
      args: [
        {
          id: 'ab',
          type: 'uppercase',
          prompt: {
            start: 'Whose full form you want to look for?',
          },
        },
      ],
      category: 'atg',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Tells the full form of an abbreviation.',
        usage: '<x>',
        examples: ['XQ'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, args) {
    const url = 'https://ni-tian-xie-shen-against-the-gods.fandom.com/wiki/Against_the_Gods_Wiki:Data';
    fetch(url)
      .then(res => {
        if (res.status !== 200) throw new Error(res.status);
        return res;
      })
      .then(res => res.text())
      .then(html => {
        const embed = new MessageEmbed();
        const $ = cheerio.load(html);
        let val = false;
        $('td').each((_, elem) => {
          if ($(elem).text().match(args.ab)) {
            val = $(elem).next('td').text()
              .trim();
            return false;
          }
          return true;
        });

        if (val) {
          embed.setColor(colors.darkviolet)
            .setDescription(`**${args.ab}:** ${val}.`);
          return message.util.send(embed);
        }
        embed.setColor(colors.mediumvioletred)
          .setDescription('Not Found!');
        return message.util.send(embed)
          .then(msg => msg.delete({ timeout: 15000, reason: 'It had to be done.' }));
      })
      .catch(console.error);
  }
}

module.exports = AbbreviationCommand;
