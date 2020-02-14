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

class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          default: null,
        },
      ],
      category: 'info',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: {
        content: 'Displays information about a command.',
        usage: '[command]',
        examples: ['ab'],
      },
      ratelimit: 2,
      typing: true,
    });
  }
  exec(message, { command }) {
    const prefix = this.handler.prefix;
    const embed = new MessageEmbed().setColor(colors.darkviolet);

    if (command) {
      embed
        .setColor(colors.darkviolet)
        .addField('❯ Usage', `${prefix[0]}${command.aliases[0]} ${command.description.usage ? command.description.usage : ''}`)
        .addField('❯ Description', command.description.content || 'No Description provided');

      if (command.aliases.length > 1) embed.addField('❯ Aliases', command.aliases.join('・'));

      if (command.description.examples && command.description.examples.length) {
        embed.addField('❯ Examples', `${prefix[0]}${command.aliases[0]} ${command.description.examples.join(`\n${command.aliases[0]}`)}`);
      }
      if (command.description.availArgs && command.description.availArgs.length) {
        embed.addField('❯ Available Arguments', command.description.availArgs.join('・'));
      }
    } else {
      embed
        .setTitle('Help Menu')
        .setDescription(`This is a list of available commands.\nType \`${prefix[0]}help <command>\` for more.\nAvailable prefix are ${prefix.join(', ')}.\n<> mean required, [] mean optional.\nNumbers represent total command in a category.`)
        .setFooter(`${this.handler.modules.size} commands found.`);

      for (const category of this.handler.categories.values()) {
        embed.addField(
          `❯ ${category.id.replace(/(\b\w)/gi, lc => lc.toUpperCase())} - ${category.size}`,
          category.filter(cmd => cmd.aliases.length > 0).map(cmd => cmd.aliases[0]).join('・'),
        );
      }
    }
    return message.util.send(embed);
  }
}

module.exports = HelpCommand;
