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

const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors');
const embed = new MessageEmbed();

class CommandBlockedListener extends Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked',
    });
  }

  exec(message, command, reason) {
    embed.setColor(colors.mediumvioletred)
      .setDescription(`${message.author.username} was blocked from using \`${command.id}\` command because ${reason}!`);
    return message.util.send(embed)
      .then(msg => msg.delete({ timeout: 15000, reason: 'It had to be done.' }));
  }
}

module.exports = CommandBlockedListener;
