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

class QuoteCommand extends Command {
  constructor() {
    super('quote', {
      aliases: ['quote', 'qt'],
      args: [
        {
          id: 'qt',
          type: 'uppercase',
          match: 'text',
          prompt: {
            start: 'Whose quote you want to look for?',
          },
        },
      ],
      category: 'atg',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Show the character quotes from ATG wikia (Randomly).',
        usage: '<x>',
        examples: ['XQ'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, args) {
    const aburl = 'https://ni-tian-xie-shen-against-the-gods.fandom.com/wiki/Against_the_Gods_Wiki:Data';
    fetch(aburl)
      .then(res => {
        if (res.status !== 200) throw new Error(res.status);
        return res;
      })
      .then(res => res.text())
      .then(html => {
        const $ = cheerio.load(html);
        let val = false;
        $('td').each((_, elem) => {
          if ($(elem).text().match(args.qt)) {
            val = $(elem).next('td').text()
              .trim();
            return false;
          }
          return true;
        });
        let qry = args.qt;
        if (val) { qry = val; }
        const query = stringify({ query: qry, limit: 1 });
        return `https://ni-tian-xie-shen-against-the-gods.fandom.com/api/v1/Search/List?${query}`;
      })
      .then(url => fetch(url))
      .then(res => {
        if (res.status !== 200) throw new Error(res.status);
        return res;
      })
      .then(res => res.json())
      .then(json => {
        const { items } = json;
        if (items.length === 0) throw new Error();
        return `${items[0].url}/Quotes`;
      })
      .then(url => fetch(url))
      .then(res => {
        if (res.status !== 200) throw new Error();
        return res;
      })
      .then(res => res.text())
      .then(html => {
        const embed = new MessageEmbed();
        const $ = cheerio.load(html);
        const quotes = [];
        $('table').has('i').each((_, elem) => {
          const quote = $(elem).find('i').text()
            .trim();
          const by = $(elem).find('small').text()
            .trim()
            .replace(/\[.*\]/, '');
          const sup = $(elem).find('sup').find('a')
            .attr('href');
          const chap = $(sup).text().trim()
            .replace(/^.*Ch/, 'Ch');
          quotes.push({ quote: quote, by: by, chap: chap });
        });
        const result = quotes[Math.floor(Math.random() * quotes.length)];
        embed.setColor(colors.darkviolet)
          .setDescription(result.quote)
          .setFooter(`${result.by} [${result.chap}]`);
        return message.util.send(embed);
      })
      .catch(e => {
        const embed = new MessageEmbed();
        embed.setColor(colors.mediumvioletred)
          .setDescription('Not Found!');
        message.util.send(embed)
          .then(msg => msg.delete({ timeout: 15000, reason: 'It had to be done.' }));
        return console.error(e);
      });
  }
}

module.exports = QuoteCommand;
