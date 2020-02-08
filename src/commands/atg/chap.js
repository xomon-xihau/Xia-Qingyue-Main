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

class ChapCommand extends Command {
  constructor() {
    super('chap', {
      aliases: ['chap'],
      clientPermissions: ['EMBED_LINKS'],
      channel: 'guild',
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message) {
    const url = 'http://book.zongheng.com/book/408586.html';
    fetch(url)
      .then(res => {
        if (res.status !== 200) throw new Error(res.status);
        return res;
      })
      .then(res => res.text())
      .then(html => {
        const embed = new MessageEmbed();
        const $ = cheerio.load(html);
        const title = $('.tit').find('a').text();
        const num = title.match(/(\d+)/)[0];
        const name = title.replace(/第.*章/g, '').trim();
        let time = $('.time').text().split('· ')[1].trim();
        const words = {
          分钟前: 'minute(s) ago',
          小时前: 'hour(s) ago',
          天前: 'day(s) ago',
          周前: 'Week(s) ago',
        };
        for (const word in words) {
          if (time.match(word)) {
            time += ` [TL: ${time.replace(word, '')} ${words[word]}]`;
            break;
          }
        }
        const send = `**Name:** ${name}\n**Number:** ${num}\n**Released:** ${time}`;
        embed.setColor(colors.darkviolet)
          .setDescription(send);
        return message.util.send(embed);
      })
      .catch(console.error);
  }
}

module.exports = ChapCommand;
