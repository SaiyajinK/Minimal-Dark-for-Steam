## ⚡ Minimal Dark for Steam ⚡ <br> 

Minimal Dark is a personalized and customizable minimal theme for the new Steam interface (New UI). <br>
I started from the basic Steam skin using the development tool (DevTools) as well as notepad++. <br>
All the sources and tools I used are at the bottom of the description. <br>

I am neither a coder nor a developer, I have some knowledge after several years of practice and I do this in my free time when I have it. <br>
Be understandable if you encounter any bugs. <br>

## `🧪 Restylised vanilla skin topbar + UI enhancements 🧪` <br> 

![steamwebhelper_2PxeAc0FeH](https://github.com/SaiyajinK/Minimal-Dark-for-Steam/assets/105972098/880797cf-768f-46a2-a2cd-bb6dfb7b3505) <br>


I created a minimal topbar to best optimize the space compared to the vanilla base. <br>
The home and collection button are now hidden to minimize the space taken up (they are accessible from the top bar). <br>

## `🎨 Customize theme with the color of your choice!🎨` <br> 

I'm not a fan of heavy interfaces with "uncoordinated" colors. So I did my best to have a theme with matching colorimetry. In building the skin, I defined a function on many elements that injects the color code defined in the configuration file across the entire skin and webkit. <br>

How change the skin color ? <br>
1. Open `-config.css-` with notepad++ and modify `line 4` and `line 5`. <br> 
2. Open `-webkit.css-` and modify `line 8` and `line 9` ; save and reload Steam. <br> 

⚠️ note: color settings reset with each update (for now).<br>

More simply : If you use the base color (which is Steam's default color, light blue): no problem since it is the base of the skin.<br>

On the other hand : If you use a custom color: you will have to redefine the custom color during EACH update (for the moment) whether manual (by opening millenium from Steam settings) or automatic (when launching or restarting Steam).<br>

Why ? : This is because Millennium, during an update reloads the entire Github directory and not just the updated files.<br>
I passed the information on to the dev, I'm waiting for his return (the problem does not occur with SFP).<br>

🗣️ Dev response : Millennium will be updated soon to resolve this issue to only update files changed during a skin update.

## `🔄 Reboot/recharge menu 🔄` <br> 

I added a js script to the skin that adds the restart and refresh UI actions. <br>
`Script has shared on the unofficial metro discord` <br>

![steamwebhelper_4FpJOM4dmK](https://github.com/SaiyajinK/Minimal-Dark-for-Steam/assets/105972098/09a09386-b252-4033-8c7a-5cb82b690776)

⚠️ note: on the beta channel, this function is no longer available. There must have been changes that broke the script. I will keep an eye out for a possible update (if it is updated of course) and if so, my skin will be updated accordingly. <br>

## `📸 Compact mode + friends 📸` <br> 

![steamwebhelper_phO93tJRKG](https://github.com/SaiyajinK/Minimal-Dark-for-Steam/assets/105972098/cd713841-5f4f-4f58-be4b-49b48b98e891) <br>

## `📸 Profil 📸` <br> 

Blurred profil : https://steamcommunity.com/id/saiyajinkk/ <br>

## `🌐 Dark webkit 🌐` <br> 
`Thanks Shiina for the base of the webkit` <br>
All aspects were changed to match my theme. <br>

![steamwebhelper_UI5b3LGnBc](https://github.com/SaiyajinK/Minimal-Dark-for-Steam/assets/105972098/47b8c8e5-c135-4b9d-81d2-ef8df6c75cea) <br> 


## `✅ Quick installation with Millennium (recommanded) ✅` <br>
1️⃣ - Download & execute latest release of Millennium [here](https://millennium.web.app/)<br>
2️⃣ - Clic on  `Integrate` and wait for the end of integration (Steam will close)<br>
3️⃣ - Restart Steam and go `Settings` > `Interface` > `Steam Skin` > `Open Millennium`<br>
4️⃣ - In Millennium interface click on `Settings` and check that `JavaScript Execution` is checked.<br>
5️⃣ - Always in Millennium interface click on `Community` (Steam browser will open).<br>
6️⃣ - Select the Minimal Dark for Steam theme and drag `Drop onto Millennium button` in the Millennium and wait download & installation<br>
7️⃣ - Return to the `Library tab` and refresh the list of downloaded skins and click on `Minimal Dark for Steam`.<br>

> Installation documentation : https://millennium.gitbook.io/steam-patcher/getting-started/installation <br>

## `🔗 Manual installation with SFP 🔗` <br>
1️⃣ - Download & extract latest release [here](https://github.com/SaiyajinK/Minimal-Dark-for-Steam/releases)<br>
2️⃣ - Copy `Minimal-Dark-for-Steam` folder to "C:\Program Files (x86)\Steam\steamui\skins\"<br>
3️⃣ - Download the latest SFP version [here](https://github.com/PhantomGamers/SFP/releases) <br>
4️⃣ - Launch SFP, in settings go to Steam, check "Inject JavaScript", and now select steam skin (steam will reload automatically). If you want dev Steam, type `-dev` on the end of launch arguments to get `-cef-enable-debugging -dev`.<br>

## `🛠️ Tools used 🛠️` <br>
- Steam DevTools <br>
- [Color picker](https://htmlcolorcodes.com/color-picker/) <br>
- [ColorSpace](https://mycolor.space) <br>
- [CSS Gradient](https://cssgradient.io/) <br>
- [Free SVG collection](https://thenounproject.com/) <br>

## `🖱️ Open Source References 🖱️` <br>
- Credits to [Rose's Metro for Steam](https://github.com/RoseTheFlower) for the initial base of the theme and the inspiration it gave me.
- [Shiina](https://github.com/AikoMidori/steam-dark-mode/blob/master/webkit.css) for the dark base of webkit<br>
- [Unofficial Patch for Metro for Steam](https://discord.gg/dMsSwufK7Q) for sharing reboot/reload script<br>
- [ShadowMonster99](https://github.com/ShadowMonster99/millennium-steam-patcher) for the implementation in Millennium<br>
- [PhantomGamers](https://github.com/PhantomGamers) for SFP and the reboot/reload script <br>
- [LaserFlash](https://github.com/LaserFlash) for WaitForElement module <br>

------
