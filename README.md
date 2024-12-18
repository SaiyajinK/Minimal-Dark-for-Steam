## ⚡ Minimal Dark for Steam ⚡ <br> 

Minimal Dark is a personalized and customizable minimal theme for the new Steam interface (New UI). <br>
I started from the basic Steam skin using the development tool (DevTools) as well as notepad++. <br>
All the sources and tools I used are at the bottom of the description. <br>

I am neither a coder nor a developer, I have some knowledge after several years of practice and I do this in my free time when I have it. <br>
Be understanding if you encounter any bugs. <br>

## `🧪 Restylised vanilla skin topbar + UI enhancements 🧪` <br> 

I created a minimal topbar to best optimize the space compared to the vanilla base. <br>
The home and collection button are now hidden to minimize the space taken up (they are accessible from the top bar). <br>

In Steam settings I recommend setting the library size to Medium. <br>
`Steam Settings` > `Library` > `Display size for library interface elements` > `Medium`  <br>

![steamwebhelper_1m9vPYV0E8](https://github.com/user-attachments/assets/6eeeba13-eec5-4a74-990b-bff0522a9170) <br>

## `🎨 Customize theme with the color of your choice 🎨` <br> 

I'm not a fan of heavy interfaces with "uncoordinated" colors. So I did my best to have a theme with matching colorimetry. In building the skin, I defined a function on many elements that injects the selected color code on the entire skin. <br>

> by default, whether you are on w10 or w11, the color of Steam will be the one you have chosen in Windows, but you can always use another color by clicking on the color selector.   <br>

How change the skin color ? <br>
Open `Steam settings` go to `Themes` and select an `custom accent`.  <br>

![steamwebhelper_E7oBaqbZF1](https://github.com/user-attachments/assets/7d66e238-e868-4def-81cb-78d4d5ce59e3) <br>

Note: the accent color does not apply on the webkit. So I set the store color with Steam's default color (the light blue `#1a9fff`).

## `📸 Compact mode + friends 📸` <br> 

![steamwebhelper_1m9vPssYV0E8](https://github.com/user-attachments/assets/95bdf58f-4388-47c0-859d-6eba2aa6e1e4) <br>

## `👤 Profil 👤` <br> 

Some profiles have neon lights around the headers, I removed them by default.<br>
If you want to remove this, open `webkit.css` and remove lines `58` to `63`<br>

![steamwebhelper_MMLpcYbpD1](https://github.com/user-attachments/assets/57fd1033-1892-4357-8204-89c166b06bfa) <br>

## `🌐 Dark webkit 🌐` <br> 
`Thanks Shiina for the base of the webkit` <br>
All aspects were changed to match my theme. <br>

![steamwebhelper_MMLpdfgcYbpD1](https://github.com/user-attachments/assets/40567ab3-4050-4887-803d-fcc583586d6b) <br>

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
- [Icon8](https://icons8.com) for Base64 icons

------

[![KoFi](https://i.imgur.com/uUuWZOm.png)](https://ko-fi.com/saiyajink)
