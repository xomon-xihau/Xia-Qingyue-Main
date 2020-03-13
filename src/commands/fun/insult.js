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

const myArray = [
  'Pathetic worm, you dare try to talk to this King....',
  'Ah, pathetic mortals, like frogs lusting after a swan\'s flesh...',
  'You don’t even deserve to be bloodstains on this King\'s sword.',
  'Hah? You think you\'re special?',
  'So I heard you talking about this King... pathetic...',
  'Heh. Are you a man or a worm? Useless.',
  'Haha, you think this King is beautiful? Why don\'t you stop thinking with your lower half you beast...',
  'Stupid. Idiotic. Worthless. Waste of my breath.',
  'Your martial arts is really nice. I’ll call you over to perform if this King ever needs a laugh.',
  'Your head would make a really good paper weight. Nevermind, your head is empty.',
  'This King shall slaughter your entire clan!',
  'You think this King farts? Ha, even if I did you\'re not worthy of smelling it.',
  'This King wants to insult you, but I’d rather not waste my breath on it.',
  'Yawn.... this King wants to be entertained, but you monkeys will not do.',
  'You think you understand this King? You act like my life is written in a book, idiot.',
  'Sigh, if this King had to weigh your worth in profound crystals, this King would have negative profound crystals.',
  'Did this King ask for your opinion?',
  'Yun Che? He\'s pathetic sure, but not as pathetic as you.',
  'World Piercer? You\'re not worthy of mentioning that word you ant.',
  'World-Defying Heavenly Manual? You know too much, die.',
];

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);

class InsultCommand extends Command {
  constructor() {
    super('insult', {
      aliases: ['insult'],
      args: [
        {
          id: 'name',
          type: 'text',
          match: 'content',
          prompt: {
            start: 'Plz provide name or ping the user.',
          },
        },
      ],
      category: 'fun',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Insult someone in XQ style.',
        usage: '<x>',
        examples: ['yun che'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  async exec(message, { name }) {
    const randomItem = myArray[Math.floor(Math.random() * myArray.length)];
    const embed = new MessageEmbed()
      .setColor(colors.darkviolet)
      .setDescription(randomItem);
    if (name.match(/<@!?\d+>/)) {
      const id = name.replace(/<|>|@|!/g, '');
      const user = await this.client.users.fetch(id);
      embed.setFooter(`— Xia Qingyue insulted ${user.username}`);
    } else {
      const names = name.split(/ +/g);
      const newname = [];
      for (const nm of names) {
        newname.push(capitalize(nm));
      }
      embed.setFooter(`— Xia Qingyue insulted ${newname.join(' ')}`);
    }
    return message.util.send(embed);
  }
}

module.exports = InsultCommand;
