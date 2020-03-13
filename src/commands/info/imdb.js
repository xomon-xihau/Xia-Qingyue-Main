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

class ImdbCommand extends Command {
  constructor() {
    super('imdb', {
      aliases: ['imdb', 'movie', 'tv'],
      args: [
        {
          id: 'search',
          match: 'text',
          prompt: {
            start: 'What you want to search on IMDB?',
          },
        },
      ],
      category: 'info',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Show the top search result on IMDB.',
        usage: '<x>',
        examples: ['Iron Man'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, args) {
    const query = stringify({ q: args.search });
    const url = `https://www.imdb.com/find?${query}`;
    console.log(args.search);
    let imdblink = null;
    fetch(url)
      .then(res => {
        if (res.status !== 200) throw new Error();
        return res;
      })
      .then(res => res.text())
      .then(html => {
        const $ = cheerio.load(html);
        const link = $('.findList').find('a').first()
          .attr('href');
        if (link) {
          imdblink = `https://www.imdb.com${link}`;
          return `https://www.imdb.com${link}`;
        }
        throw new Error();
      })
      .then(link => fetch(link))
      .then(res => {
        if (res.status !== 200) throw new Error();
        return res;
      })
      .then(res => res.text())
      .then(imdb => {
        const $ = cheerio.load(imdb);
        const title = $('.title_wrapper').find('h1').text()
          .trim();
        const img = $('.poster').find('img').attr('src');
        const text = $('.summary_text').text()
          .trim();
        const rating = $('.ratingValue').find('strong').attr('title')
          .trim();
        const embed = new MessageEmbed()
          .setTitle(title)
          .setColor(colors.darkviolet)
          .setURL(imdblink)
          .setDescription(text)
          .setFooter(`IMDb: ⭐ ${rating}`);
        if (img) {
          embed.setThumbnail(img);
        }
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

module.exports = ImdbCommand;
