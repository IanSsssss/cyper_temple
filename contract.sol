// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract CyperTemple {

    struct Prayer {
        string content;
        address sender;
        string nickname;
        uint256 time;
        string godId;
    }

    string[] public GodsList = ["rulai", "puxian", "wenshu", "mingwang", "xukongzang", "emituofo"];

    mapping(string => Prayer[]) public PrayerMap;

    constructor() {
        for (uint256 i = 0; i< GodsList.length; i++) {
            PrayerMap[GodsList[i]].push(Prayer(
                "Write what you want.",
                msg.sender,
                "Author",
                block.timestamp,
                GodsList[i]
            ));
        }
    }

    event NewMsgSubmit(string content, string nickname, uint256 timestamp, address sender, string godId);

    function submit(string memory content, string memory nickname, string memory godId) public {
        require(bytes(content).length > 0 && bytes(nickname).length > 0 && bytes(godId).length > 0,  "Can not imput empty text or nickname");

        Prayer memory newMessage = Prayer(content, msg.sender, nickname, block.timestamp, godId);
        PrayerMap[godId].push(newMessage);
        emit NewMsgSubmit(content, nickname, block.timestamp, msg.sender, godId);
    } 

    function getPrayerList(string memory godId) view public returns (Prayer[] memory){
        return PrayerMap[godId];
    }
}