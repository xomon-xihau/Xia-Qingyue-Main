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
const colors = require('../../utils/colors');

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);
const shorten = text => text.length > 200 ? `${text.substr(0, 200 - 3)}...` : text;

class AnimeCommand extends Command {
  constructor() {
    super('anime', {
      aliases: ['anime'],
      args: [
        {
          id: 'search',
          match: 'text',
          prompt: {
            start: 'What anime you want to search?',
          },
        },
      ],
      category: 'info',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Show the top anime search result on Kitsu.',
        usage: '<x>',
        examples: ['masamune'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, args) {
    const query = stringify({ 'filter[text]': args.search });
    const url = `https://kitsu.io/api/edge/anime?${query}`;
    console.log(args.search);
    fetch(url)
      .then(res => {
        if (res.status !== 200) throw new Error();
        return res;
      })
      .then(res => res.json())
      .then(json => {
        const { data } = json;
        if (data.length) {
          const anime = data[0].attributes;
          const link = `https://kitsu.io/anime/${anime.slug}`;
          const footer = `${capitalize(anime.status)}・${anime.episodeCount} ep(s)・❤️ ${anime.popularityRank}・⭐ ${anime.ratingRank}`;
          const embed = new MessageEmbed()
            .setTitle(anime.canonicalTitle)
            .setColor(colors.darkviolet)
            .setURL(link)
            .setThumbnail(anime.posterImage.original.replace(/\?.*/, ''))
            .setDescription(shorten(anime.synopsis))
            .setFooter(footer);
          return message.util.send(embed);
        }
        throw new Error();
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

module.exports = AnimeCommand;
