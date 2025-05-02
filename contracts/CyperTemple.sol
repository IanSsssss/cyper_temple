// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract CyperTemple {

    struct Prayer {
        string content;
        address sender;
        string nickname;
        uint16 godId;
    }

    struct God {
        string name;
        string desc;
        string imgUrl;
        string subDesc;
        uint16 godNum;
        uint128 prayerCount;
    }

    uint16 godNum;

    God[] public GodsList;

    mapping(uint16 => Prayer[]) public PrayerMap;

    constructor() {
        // 如来
        GodsList.push(God("Gautama Buddha", "Enlightened Buddha, guiding souls to nirvana peace","1", "Seek truth, abandon delusion, awaken.", 0 ,0));
        // 普贤
        GodsList.push(God("Samantabhadra Bodhisattva", "Bodhisattva of vast vows, spreading boundless merit","1", "Vow greatly, save all, reach Buddhahood.", 1,0));
        // 文殊
        GodsList.push(God("Manjushri Bodhisattva", "Wisdom sword-bearer, slicing through ignorance.","1", "Sharpen mind, cut delusion, awaken", 2,0));
        // 耶稣
        GodsList.push(God("Jesus Christ", "Son of God, redeeming souls with divine love.","1", "Love all, trust God, gain eternal life", 3,0));
        // 不动明王
        GodsList.push(God("Acala", "Fiery Wisdom King, guarding Dharma with wrath","1", "Fear my flames, conquer evil, rise", 4,0));
        // 克苏鲁
        GodsList.push(God("Cthulhu", "Great Old One, dreaming in R\u0060lyeh\u0060s depths.","1", "Know chaos, embrace the abyss.", 5,0));
        // 奈亚拉托提普
        GodsList.push(God("Nyarlathotep", "Crawling Chaos, whispering madness in shadows","1", "Heed my whispers, embrace insanity.", 6,0));

        godNum = 7;
    }

    event NewMsgSubmit(string content, string nickname, address sender, uint16 godId);

    function submit(string memory content, string memory nickname, uint16 godId) public {
        require(bytes(content).length > 0 && bytes(nickname).length > 0 ,  "Can not input empty text or nickname");

        Prayer memory newMessage = Prayer(content, msg.sender, nickname, godId);
        PrayerMap[godId].push(newMessage);
        GodsList[godId].prayerCount +=1;
        emit NewMsgSubmit(content, nickname, msg.sender, godId);
    } 

    function getPrayerList(uint16 godId) view public returns (Prayer[] memory){
        return PrayerMap[godId];
    }

    function createGod(string memory godName, string memory desc, string memory imgUrl, string memory subDesc) public {
        godNum += 1;
        GodsList.push(God(
            godName,
            desc,
            imgUrl,
            subDesc,
            godNum,
            0
        ));
    }

    function godList() view public returns(God[] memory) {
        return GodsList;
    }
}