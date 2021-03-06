function createTemplate(options, messages) {
  const {
    showDebugLog,
    showAbout,
    openReleaseNotes,
    openNewBugForm,
    openSupportPage,
    openForums,
    setupWithImport,
    setupAsNewDevice,
    setupAsStandalone,
  } = options;

  const template = [{
    label: messages.mainMenuFile.message,
    submenu: [
      {
        role: 'quit',
      },
    ],
  },
  {
    label: messages.mainMenuEdit.message,
    submenu: [
      {
        role: 'undo',
      },
      {
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        role: 'cut',
      },
      {
        role: 'copy',
      },
      {
        role: 'paste',
      },
      {
        role: 'pasteandmatchstyle',
      },
      {
        role: 'delete',
      },
      {
        role: 'selectall',
      },
    ],
  },
  {
    label: messages.mainMenuView.message,
    submenu: [
      {
        role: 'resetzoom',
      },
      {
        role: 'zoomin',
      },
      {
        role: 'zoomout',
      },
      {
        type: 'separator',
      },
      {
        role: 'togglefullscreen',
      },
      {
        type: 'separator',
      },
      {
        label: messages.debugLog.message,
        click: showDebugLog,
      },
      {
        type: 'separator',
      },
      {
        role: 'toggledevtools',
      },
    ],
  },
  {
    label: messages.mainMenuWindow.message,
    role: 'window',
    submenu: [
      {
        role: 'minimize',
      },
    ],
  },
  {
    label: messages.mainMenuHelp.message,
    role: 'help',
    submenu: [
      {
        label: messages.goToReleaseNotes.message,
        click: openReleaseNotes,
      },
      {
        type: 'separator',
      },
      {
        label: messages.goToForums.message,
        click: openForums,
      },
      {
        label: messages.goToSupportPage.message,
        click: openSupportPage,
      },
      {
        label: messages.fileABug.message,
        click: openNewBugForm,
      },
      {
        type: 'separator',
      },
      {
        label: messages.aboutSignalDesktop.message,
        click: showAbout,
      },
    ],
  }];

  if (options.includeSetup) {
    const fileMenu = template[0];

    // These are in reverse order, since we're prepending them one at a time
    if (options.development) {
      fileMenu.submenu.unshift({
        label: messages.menuSetupAsStandalone.message,
        click: setupAsStandalone,
      });
    }

    fileMenu.submenu.unshift({
      label: messages.menuSetupAsNewDevice.message,
      click: setupAsNewDevice,
    });
    fileMenu.submenu.unshift({
      label: messages.menuSetupWithImport.message,
      click: setupWithImport,
    });
  }

  if (process.platform === 'darwin') {
    return updateForMac(template, messages, options);
  }

  return template;
}

function updateForMac(template, messages, options) {
  const {
    showWindow,
    showAbout,
    setupWithImport,
    setupAsNewDevice,
    setupAsStandalone,
  } = options;

  // Remove About item and separator from Help menu, since it's on the first menu
  template[4].submenu.pop();
  template[4].submenu.pop();

  // Remove File menu
  template.shift();

  if (options.includeSetup) {
    // Add a File menu just for these setup options. Because we're using unshift(), we add
    //   the file menu first, though it ends up to the right of the Signal Desktop menu.
    const fileMenu = {
      label: messages.mainMenuFile.message,
      submenu: [
        {
          label: messages.menuSetupWithImport.message,
          click: setupWithImport,
        },
        {
          label: messages.menuSetupAsNewDevice.message,
          click: setupAsNewDevice,
        },
      ],
    };

    if (options.development) {
      fileMenu.submenu.push({
        label: messages.menuSetupAsStandalone.message,
        click: setupAsStandalone,
      });
    }

    template.unshift(fileMenu);
  }

  // Add the OSX-specific Signal Desktop menu at the far left
  template.unshift({
    submenu: [
      {
        label: messages.aboutSignalDesktop.message,
        click: showAbout,
      },
      {
        type: 'separator',
      },
      {
        role: 'hide',
      },
      {
        role: 'hideothers',
      },
      {
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
      },
    ],
  });

  // Add to Edit menu
  const editIndex = options.includeSetup ? 2 : 1;
  template[editIndex].submenu.push(
    {
      type: 'separator',
    },
    {
      label: messages.speech.message,
      submenu: [
        {
          role: 'startspeaking',
        },
        {
          role: 'stopspeaking',
        },
      ],
    }
  );

  // Replace Window menu
  const windowIndex = options.includeSetup ? 4 : 3;
  // eslint-disable-next-line no-param-reassign
  template[windowIndex].submenu = [
    {
      accelerator: 'CmdOrCtrl+W',
      role: 'close',
    },
    {
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize',
    },
    {
      role: 'zoom',
    },
    {
      label: messages.show.message,
      click: showWindow,
    },
    {
      type: 'separator',
    },
    {
      role: 'front',
    },
  ];

  return template;
}

module.exports = createTemplate;
