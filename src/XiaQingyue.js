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

const {
  AkairoClient,
  CommandHandler,
  InhibitorHandler,
  ListenerHandler,
} = require('discord-akairo');

const { MessageEmbed } = require('discord.js');
const { join } = require('path');
const colors = require('./utils/colors');

const embed = new MessageEmbed();

const commandsPath = join(__dirname, 'commands/');
const listenersPath = join(__dirname, 'listeners/');
const inhibitorsPath = join(__dirname, 'inhibitors/');

class XiaQingyue extends AkairoClient {
  constructor() {
    super({
      ownerID: ['667363743021268992'],
    }, {
      disableEveryone: true,
    });

    this.commandHandler = new CommandHandler(this, {
      automateCategories: true,
      argumentDefaults: {
        prompt: {
          modifyStart: (message, text) => {
            embed.setColor(colors.forestgreen)
              .setDescription(text);
            return embed;
          },
          modifyRetry: (message, text) => {
            embed.setColor(colors.forestgreen)
              .setDescription(text);
            return embed;
          },
          timeout: () => {
            embed.setColor(colors.mediumvioletred)
              .setDescription('Out of time.');
            return embed;
          },
          ended: () => {
            embed.setColor(colors.mediumvioletred)
              .setDescription('No more tries.');
            return embed;
          },
          cancel: () => {
            embed.setColor(colors.mediumvioletred)
              .setDescription('Cancelled.');
            return embed;
          },
          modifyOtherwise: (message, text) => {
            embed.setColor(colors.forestgreen)
              .setDescription(text);
            return embed;
          },
          retries: 2,
        },
      },
      commandUtil: true,
      commandUtilLifetime: 300000,
      commandUtilSweepInterval: 300000,
      directory: commandsPath,
      defaultCooldown: 30000,
      fetchMembers: true,
      handleEdits: true,
      prefix: ['--', '—', '?'],
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      automateCategories: true,
      directory: inhibitorsPath,
    });

    this.listenerHandler = new ListenerHandler(this, {
      automateCategories: true,
      directory: listenersPath,
    });

    this.setup();
  }

  setup() {
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      process: process,
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
    });

    this.commandHandler.loadAll();
    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
  }
}

module.exports = XiaQingyue;

