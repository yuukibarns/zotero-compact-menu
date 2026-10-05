function startup() { run().catch(error => IOUtils.writeUTF8(CONFIG.result, JSON.stringify({ done:true, error:String(error), stack:error.stack }))); }
function shutdown() {}
function install() {}
function uninstall() {}
async function run() {
  await Zotero.initializationPromise;
  await Zotero.uiReadyPromise;
  const win=Zotero.getMainWindow(), doc=win.document;
  for(let i=0;i<100&&!doc.getElementById('compact-menu-button');i++) await Zotero.Promise.delay(100);
  const check=(value,message)=>{if(!value)throw new Error(message);};
  const button=doc.getElementById('compact-menu-button'), popup=doc.getElementById('compact-menu-popup');
  const title=doc.getElementById('titlebar'), menus=doc.getElementById('main-menubar');
  check(button,'Plugin installed');
  check(win.getComputedStyle(title).display==='none','Menu row hidden');
  check(button.getBoundingClientRect().width>0,'Hamburger visible');
  check(doc.getElementById('zotero-title-bar').firstElementChild===button,'Hamburger is first in tab row');
  check(button.getBoundingClientRect().right<=doc.getElementById('tab-bar-container').getBoundingClientRect().left,'Hamburger sits to the left of tabs');
  check(button.querySelector('.compact-menu-icon').getBoundingClientRect().width===18,'Wide icon uses stable geometry');
  check(doc.querySelector('#zotero-tabs-toolbar > .titlebar-buttonbox'),'Controls relocated');
  check(doc.querySelector('#zotero-tabs-toolbar .titlebar-close').getBoundingClientRect().width>0,'Close control remains visible');
  const file=doc.getElementById('fileMenu'), filePopup=doc.getElementById('menu_FilePopup');
  check(file.parentNode===popup,'Original File menu in hamburger');
  popup.openPopup(button,'after_end');
  await Zotero.Promise.delay(150);
  check(popup.state==='open','Hamburger popup opens');
  filePopup.openPopup(file,'end_before');
  await Zotero.Promise.delay(150);
  check(filePopup.state==='open','Native File submenu opens');
  filePopup.hidePopup();popup.hidePopup();
  doc.getElementById('compact-menu-toggle').doCommand();
  await Zotero.Promise.delay(100);
  check(win.getComputedStyle(title).display!=='none','Show menu bar toggle');
  check(file.parentNode===menus,'Native menu restored');
  check(doc.querySelector('#titlebar > .titlebar-buttonbox'),'Controls restored');
  popup.openPopup(button,'after_end');await Zotero.Promise.delay(100);
  check(file.parentNode===menus,'Visible bar keeps its native heading');
  check(file.getBoundingClientRect().width>0,'Top File heading remains visible');
  check(filePopup.parentNode.parentNode===popup,'Hamburger borrows original submenu only');
  filePopup.openPopup(filePopup.parentNode,'end_before');await Zotero.Promise.delay(100);
  check(filePopup.state==='open','Borrowed native submenu opens');
  check(file.parentNode===menus && file.getBoundingClientRect().width>0,'Heading survives open submenu');
  filePopup.hidePopup();
  popup.hidePopup();await Zotero.Promise.delay(100);
  check(file.parentNode===menus,'Popup close restores visible bar');
  check(filePopup.parentNode===file,'Popup returned to native heading');
  filePopup.openPopup(file,'after_start');await Zotero.Promise.delay(100);
  check(filePopup.state==='open','Top File menu works after hamburger closes');filePopup.hidePopup();
  doc.getElementById('compact-menu-toggle').doCommand();
  await Zotero.Promise.delay(100);
  check(win.getComputedStyle(title).display==='none','Hide again');
  const {AddonManager}=ChromeUtils.importESModule('resource://gre/modules/AddonManager.sys.mjs');
  const addon=await AddonManager.getAddonByID('compact-menu@yuukibarns');await addon.disable();
  check(!doc.getElementById('compact-menu-button'),'Disable removes button');
  check(file.parentNode===menus,'Disable restores original menu');
  check(win.getComputedStyle(title).display!=='none','Disable restores top row');
  await IOUtils.writeUTF8(CONFIG.result,JSON.stringify({done:true,passed:true,version:Zotero.version}));
}
