import { app, BrowserWindow, Menu, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';

// URL da sua aplicação no Render
const APP_URL = 'https://cred-management-frontend.onrender.com';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // Cria a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'Cred Management+',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
    autoHideMenuBar: false,
    backgroundColor: '#1e293b',
    show: false, // Não mostra até estar pronta
  });

  // Carrega a aplicação web do Render
  mainWindow.loadURL(APP_URL);

  // Mostra a janela quando pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  // Abre links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Previne navegação para outros domínios
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const appUrlParsed = new URL(APP_URL);
    
    if (parsedUrl.origin !== appUrlParsed.origin) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Emitido quando a janela é fechada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Cria o menu da aplicação
  createMenu();

  // Log de erros
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Falha ao carregar:', errorCode, errorDescription);
    
    if (mainWindow) {
      mainWindow.loadURL(`data:text/html;charset=utf-8,
        <html>
          <head>
            <style>
              body {
                background: #1e293b;
                color: white;
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
              }
              .error-container {
                text-align: center;
                max-width: 600px;
                padding: 40px;
              }
              h1 { color: #ef4444; }
              button {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
              }
              button:hover { background: #2563eb; }
            </style>
          </head>
          <body>
            <div class="error-container">
              <h1>⚠️ Erro de Conexão</h1>
              <p>Não foi possível conectar ao servidor.</p>
              <p>Verifique sua conexão com a internet e tente novamente.</p>
              <p><small>Código: ${errorCode}</small></p>
              <button onclick="location.reload()">🔄 Tentar Novamente</button>
            </div>
          </body>
        </html>
      `);
    }
  });
}

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Recarregar',
          accelerator: 'F5',
          click: () => {
            mainWindow?.reload();
          },
        },
        {
          label: 'Forçar Recarregar',
          accelerator: 'Ctrl+F5',
          click: () => {
            mainWindow?.webContents.reloadIgnoringCache();
          },
        },
        { type: 'separator' },
        {
          label: 'Sair',
          accelerator: 'Alt+F4',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Desfazer' },
        { role: 'redo', label: 'Refazer' },
        { type: 'separator' },
        { role: 'cut', label: 'Recortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Colar' },
        { role: 'selectAll', label: 'Selecionar Tudo' },
      ],
    },
    {
      label: 'Visualizar',
      submenu: [
        {
          label: 'Aumentar Zoom',
          accelerator: 'Ctrl+Plus',
          click: () => {
            const currentZoom = mainWindow?.webContents.getZoomLevel() || 0;
            mainWindow?.webContents.setZoomLevel(currentZoom + 0.5);
          },
        },
        {
          label: 'Diminuir Zoom',
          accelerator: 'Ctrl+-',
          click: () => {
            const currentZoom = mainWindow?.webContents.getZoomLevel() || 0;
            mainWindow?.webContents.setZoomLevel(currentZoom - 0.5);
          },
        },
        {
          label: 'Zoom Padrão',
          accelerator: 'Ctrl+0',
          click: () => {
            mainWindow?.webContents.setZoomLevel(0);
          },
        },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Tela Cheia' },
      ],
    },
    {
      label: 'Ajuda',
      submenu: [
        {
          label: 'Sobre',
          click: async () => {
            const { dialog } = await import('electron');
            dialog.showMessageBox({
              type: 'info',
              title: 'Sobre',
              message: 'Cred Management+',
              detail: `Versão: ${app.getVersion()}\n\nSistema de Gestão de Crédito Consignado\n\n© 2026 Cred Management+`,
              buttons: ['OK'],
            });
          },
        },
        { type: 'separator' },
        {
          label: 'Ferramentas de Desenvolvedor',
          accelerator: 'F12',
          click: () => {
            mainWindow?.webContents.toggleDevTools();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Este método será chamado quando o Electron terminar a inicialização
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // No macOS é comum recriar uma janela quando o ícone é clicado
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Sair quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Desabilita aviso de segurança no console
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
