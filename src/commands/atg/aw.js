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
const { stringify } = require('querystring');

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const colors = require('../../utils/colors');

class WikiaCommand extends Command {
  constructor() {
    super('wikia', {
      aliases: ['wikia', 'wiki', 'aw'],
      args: [
        {
          id: 'search',
          match: 'text',
          prompt: {
            start: 'What you want to search on wikia?',
          },
        },
      ],
      category: 'atg',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Show the top search result on wikia.',
        usage: '<x>',
        examples: ['Xia Qingyue'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, args) {
    const query = stringify({ query: args.search, limit: 1 });
    const url = `https://ni-tian-xie-shen-against-the-gods.fandom.com/api/v1/Search/List?${query}`;
    fetch(url)
      .then(res => {
        if (res.status !== 200) throw new Error(res.status);
        return res;
      })
      .then(res => res.json())
      .then(json => {
        const { items } = json;
        const embed = new MessageEmbed();
        if (items.length && !items[0].title.match('Against the Gods Wiki:Data')) {
          const $ = cheerio.load(items[0].snippet);
          embed.setColor(colors.darkviolet)
            .setURL(items[0].url)
            .setTitle(items[0].title);
          if (!items[0].title.match('/')) embed.setFooter(`${$.text().trim()}...`);
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

module.exports = WikiaCommand;
