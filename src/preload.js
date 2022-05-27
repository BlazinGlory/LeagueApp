const os = require('os');
const { ipcRenderer, contextBridge } = require('electron');

// API
const API = {
    window: {
        minimize: () => ipcRenderer.send('minimize'),
        maximize: () => ipcRenderer.send('maximize'),
        close: () => ipcRenderer.send('close'),
    },
    lcu: async () => {
        const result = await ipcRenderer.invoke("lcuvalues");
        console.log('Connecting to LCU')
    },
    favorite: async (champ) => {
        const result = await ipcRenderer.invoke("favorite", champ);
        console.log('Saved as favorite');
    },
    selectFolder: async () => {
        ipcRenderer.invoke('selectFolder');
        document.getElementById('path')
    },
    data: {
        name: async (name) => {
            const result = await ipcRenderer.invoke("name", name);
            document.getElementById('sumID').textContent = result.id;
            console.log(name);
        },
        lcuinfo: async () => {
            const result = await ipcRenderer.invoke("lcuinfo");
            document.getElementById('sumName').textContent = result.displayName;
            document.getElementById('iconId').textContent = result.profileIconId;
            console.log(result);
        },
        seticon: async (num) => {
            const result = await ipcRenderer.invoke('seticon', num);
            if (result.profileIconId == num) {
                console.log('Icon change successful');
            } else {
                console.log('Icon change unsuccessful');
            }
        },
        runepage: async () => {
            const result = await ipcRenderer.invoke('runepage');
            if (result.id) {
                console.log('Rune page #' + result.id);
                document.getElementById('runenum').textContent = result.id;
            } else {
                console.log('error when getting rune id')
            }
        },
        deleteRune: async (id) => {
            const result = await ipcRenderer.invoke('deleteRune', id);
            if (result.size == 0) {
                console.log('Rune page #' + id + ' deleted.');
            } else {
                console.log('error when deleting rune page')
            }
        },
        newpage: async (champ, num) => {
            const allrunes = await ipcRenderer.invoke('getrunes', champ);
            const rune = allrunes[num];
            document.getElementById('runenum').textContent = rune.id;
            document.getElementById('currentnum').textContent = rune.id;
            const result = await ipcRenderer.invoke('newpage', rune);
            if (result.id) {
                console.log('Rune page created.');
            } else {
                console.log('error when creating rune page')
            }
        },
        getrunes: async (champ, j) => {
            const result = await ipcRenderer.invoke('getrunes', champ);
            let found = [];
            let perkIds = result[j].selectedPerkIds.filter(x => x > 6000);
            let stats = result[j].selectedPerkIds.filter(x => x < 6000);

            const select = document.querySelectorAll(".selected");
            select.forEach(item => {
                item.classList.remove("selected");
            })
            for (k = 0; k < result.length; k++) {
                document.getElementById("span" + (k + 1)).textContent = result[k].name;
            }
            document.getElementById("primaryMain").classList.add("selected");
            document.getElementById("secondaryMain").classList.add("selected");

            // Precision Primary
            if (result[j].primaryStyleId == 8000) {
                if (result[j].subStyleId == 8100) {
                    document.getElementById("secondary1").classList.add("selected");
                } else if (result[j].subStyleId == 8200) {
                    document.getElementById("secondary2").classList.add("selected");
                } else if (result[j].subStyleId == 8300) {
                    document.getElementById("secondary4").classList.add("selected");
                } else if (result[j].subStyleId == 8400) {
                    document.getElementById("secondary3").classList.add("selected");
                }
                document.getElementById("main1").classList.add("selected");
                document.querySelector("#secondary1 img").src = "../images/perk-images/Styles/7200_Domination.png";
                document.querySelector("#secondary2 img").src = "../images/perk-images/Styles/7202_Sorcery.png";
                document.querySelector("#secondary3 img").src = "../images/perk-images/Styles/7204_Resolve.png";
                document.querySelector("#secondary4 img").src = "../images/perk-images/Styles/7203_Whimsy.png";
                for (i = 0; i < perkIds.length - 1; i++) {
                    if (perkIds[i] == 8005) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png";
                        document.getElementById("keystone1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8008) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png";
                        document.getElementById("keystone2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8021) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png";
                        document.getElementById("keystone3").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8010) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Precision/Conqueror/Conqueror.png";
                        document.getElementById("keystone4").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 9101) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Precision/Overheal.png";
                        document.getElementById("sub1_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 9111) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Precision/Triumph.png";
                        document.getElementById("sub1_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8009) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png";
                        document.getElementById("sub1_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 9104) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png";
                        document.getElementById("sub2_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 9105) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png";
                        document.getElementById("sub2_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 9103) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png";
                        document.getElementById("sub2_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8014) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png";
                        document.getElementById("sub3_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8017) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Precision/CutDown/CutDown.png";
                        document.getElementById("sub3_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8299) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Sorcery/LastStand/LastStand.png";
                        document.getElementById("sub3_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }
                }

                document.querySelector("#primaryMain img").src = "../images/perk-images/Styles/7201_Precision.png";
                document.querySelector("#keystone1 img").src = "../images/perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png";
                document.querySelector("#keystone2 img").src = "../images/perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png";
                document.querySelector("#keystone3 img").src = "../images/perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png";
                document.querySelector("#keystone4 img").src = "../images/perk-images/Styles/Precision/Conqueror/Conqueror.png";
                document.getElementById("keystone4").classList.remove("hidden");
                document.querySelector("#sub1_1 img").src = "../images/perk-images/Styles/Precision/Overheal.png";
                document.querySelector("#sub1_2 img").src = "../images/perk-images/Styles/Precision/Triumph.png";
                document.querySelector("#sub1_3 img").src = "../images/perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png";
                document.querySelector("#sub2_1 img").src = "../images/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png";
                document.querySelector("#sub2_2 img").src = "../images/perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png";
                document.querySelector("#sub2_3 img").src = "../images/perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png";
                document.querySelector("#sub3_1 img").src = "../images/perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png";
                document.querySelector("#sub3_2 img").src = "../images/perk-images/Styles/Precision/CutDown/CutDown.png";
                document.querySelector("#sub3_3 img").src = "../images/perk-images/Styles/Sorcery/LastStand/LastStand.png";
                document.getElementById("sub3_4").classList.add("hidden");
            }
            // Domination Primary
            else if (result[j].primaryStyleId == 8100) {
                if (result[j].subStyleId == 8000) {
                    document.getElementById("secondary1").classList.add("selected");
                } else if (result[j].subStyleId == 8200) {
                    document.getElementById("secondary2").classList.add("selected");
                } else if (result[j].subStyleId == 8300) {
                    document.getElementById("secondary4").classList.add("selected");
                } else if (result[j].subStyleId == 8400) {
                    document.getElementById("secondary3").classList.add("selected");
                }
                document.getElementById("main2").classList.add("selected");
                document.querySelector("#secondary1 img").src = "../images/perk-images/Styles/7201_Precision.png";
                document.querySelector("#secondary2 img").src = "../images/perk-images/Styles/7202_Sorcery.png";
                document.querySelector("#secondary3 img").src = "../images/perk-images/Styles/7204_Resolve.png";
                document.querySelector("#secondary4 img").src = "../images/perk-images/Styles/7203_Whimsy.png";
                for (i = 0; i < perkIds.length - 1; i++) {
                    if (perkIds[i] == 8112) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Domination/Electrocute/Electrocute.png";
                        document.getElementById("keystone1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8124) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Domination/Predator/Predator.png";;
                        document.getElementById("keystone2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8128) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png";
                        document.getElementById("keystone3").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 9923) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png";
                        document.getElementById("keystone4").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8126) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Domination/CheapShot/CheapShot.png";
                        document.getElementById("sub1_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8139) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png";
                        document.getElementById("sub1_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8143) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png";
                        document.getElementById("sub1_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8136) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Domination/ZombieWard/ZombieWard.png";
                        document.getElementById("sub2_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8120) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Domination/GhostPoro/GhostPoro.png";
                        document.getElementById("sub2_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8138) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png";
                        document.getElementById("sub2_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8135) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png";
                        document.getElementById("sub3_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8134) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Domination/IngeniousHunter/IngeniousHunter.png";
                        document.getElementById("sub3_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8105) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png";
                        document.getElementById("sub3_3").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8106) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png";
                        document.getElementById("sub3_4").classList.add("selected");
                        found[i] = perkIds[i];
                    }
                }
                document.querySelector("#primaryMain img").src = "../images/perk-images/Styles/7200_Domination.png";
                document.querySelector("#keystone1 img").src = "../images/perk-images/Styles/Domination/Electrocute/Electrocute.png";
                document.querySelector("#keystone2 img").src = "../images/perk-images/Styles/Domination/Predator/Predator.png";
                document.querySelector("#keystone3 img").src = "../images/perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png";
                document.querySelector("#keystone4 img").src = "../images/perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png";
                document.getElementById("keystone4").classList.remove("hidden");
                document.querySelector("#sub1_1 img").src = "../images/perk-images/Styles/Domination/CheapShot/CheapShot.png";
                document.querySelector("#sub1_2 img").src = "../images/perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png";
                document.querySelector("#sub1_3 img").src = "../images/perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png";
                document.querySelector("#sub2_1 img").src = "../images/perk-images/Styles/Domination/ZombieWard/ZombieWard.png";
                document.querySelector("#sub2_2 img").src = "../images/perk-images/Styles/Domination/GhostPoro/GhostPoro.png";
                document.querySelector("#sub2_3 img").src = "../images/perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png";
                document.querySelector("#sub3_1 img").src = "../images/perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png";
                document.querySelector("#sub3_2 img").src = "../images/perk-images/Styles/Domination/IngeniousHunter/IngeniousHunter.png";
                document.querySelector("#sub3_3 img").src = "../images/perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png";
                document.getElementById("sub3_4").classList.remove("hidden");
            }
            // Sorcery Primary
            else if (result[j].primaryStyleId == 8200) {
                if (result[j].subStyleId == 8000) {
                    document.getElementById("secondary1").classList.add("selected");
                } else if (result[j].subStyleId == 8100) {
                    document.getElementById("secondary2").classList.add("selected");
                } else if (result[j].subStyleId == 8300) {
                    document.getElementById("secondary4").classList.add("selected");
                } else if (result[j].subStyleId == 8400) {
                    document.getElementById("secondary3").classList.add("selected");
                }
                document.getElementById("main3").classList.add("selected");
                document.querySelector("#secondary1 img").src = "../images/perk-images/Styles/7201_Precision.png";
                document.querySelector("#secondary2 img").src = "../images/perk-images/Styles/7200_Domination.png";
                document.querySelector("#secondary3 img").src = "../images/perk-images/Styles/7204_Resolve.png";
                document.querySelector("#secondary4 img").src = "../images/perk-images/Styles/7203_Whimsy.png";
                for (i = 0; i < perkIds.length - 1; i++) {
                    if (perkIds[i] == 8214) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Sorcery/SummonAery/SummonAery.png";
                        document.getElementById("keystone1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8229) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png";
                        document.getElementById("keystone2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8230) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png";
                        document.getElementById("keystone3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8224) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Sorcery/NullifyingOrb/Pokeshield.png";
                        document.getElementById("sub1_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8226) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png";
                        document.getElementById("sub1_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8275) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Sorcery/NimbusCloak/6361.png";
                        document.getElementById("sub1_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8210) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Sorcery/Transcendence/Transcendence.png";
                        document.getElementById("sub2_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8234) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Sorcery/Celerity/CelerityTemp.png";
                        document.getElementById("sub2_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8233) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png";
                        document.getElementById("sub2_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8237) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Sorcery/Scorch/Scorch.png";
                        document.getElementById("sub3_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8232) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png";
                        document.getElementById("sub3_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8236) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png";
                        document.getElementById("sub3_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }
                }


                document.querySelector("#primaryMain img").src = "../images/perk-images/Styles/7202_Sorcery.png";
                document.querySelector("#keystone1 img").src = "../images/perk-images/Styles/Sorcery/SummonAery/SummonAery.png";
                document.querySelector("#keystone2 img").src = "../images/perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png";
                document.querySelector("#keystone3 img").src = "../images/perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png";
                document.querySelector("#keystone4 img").src = "";
                document.getElementById("keystone4").classList.add("hidden");
                document.querySelector("#sub1_1 img").src = "../images/perk-images/Styles/Sorcery/NullifyingOrb/Pokeshield.png";
                document.querySelector("#sub1_2 img").src = "../images/perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png";
                document.querySelector("#sub1_3 img").src = "../images/perk-images/Styles/Sorcery/NimbusCloak/6361.png";
                document.querySelector("#sub2_1 img").src = "../images/perk-images/Styles/Sorcery/Transcendence/Transcendence.png";
                document.querySelector("#sub2_2 img").src = "../images/perk-images/Styles/Sorcery/Celerity/CelerityTemp.png";
                document.querySelector("#sub2_3 img").src = "../images/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png";
                document.querySelector("#sub3_1 img").src = "../images/perk-images/Styles/Sorcery/Scorch/Scorch.png";
                document.querySelector("#sub3_2 img").src = "../images/perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png";
                document.querySelector("#sub3_3 img").src = "../images/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png";
                document.getElementById("sub3_4").classList.add("hidden");
            }
            // Inspiration Primary
            else if (result[j].primaryStyleId == 8300) {
                if (result[j].subStyleId == 8000) {
                    document.getElementById("secondary1").classList.add("selected");
                } else if (result[j].subStyleId == 8100) {
                    document.getElementById("secondary2").classList.add("selected");
                } else if (result[j].subStyleId == 8400) {
                    document.getElementById("secondary4").classList.add("selected");
                } else if (result[j].subStyleId == 8200) {
                    document.getElementById("secondary3").classList.add("selected");
                }
                document.getElementById("main5").classList.add("selected");
                document.querySelector("#secondary1 img").src = "../images/perk-images/Styles/7201_Precision.png";
                document.querySelector("#secondary2 img").src = "../images/perk-images/Styles/7200_Domination.png";
                document.querySelector("#secondary3 img").src = "../images/perk-images/Styles/7202_Sorcery.png";
                document.querySelector("#secondary4 img").src = "../images/perk-images/Styles/7204_Resolve.png";
                for (i = 0; i < perkIds.length - 1; i++) {
                    if (perkIds[i] == 8351) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png";
                        document.getElementById("keystone1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8360) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png";
                        document.getElementById("keystone2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8369) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png";
                        document.getElementById("keystone3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8306) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png";
                        document.getElementById("sub1_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8304) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png";
                        document.getElementById("sub1_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8313) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Inspiration/PerfectTiming/PerfectTiming.png";
                        document.getElementById("sub1_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8321) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Inspiration/FuturesMarket/FuturesMarket.png";
                        document.getElementById("sub2_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8316) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Inspiration/MinionDematerializer/MinionDematerializer.png";
                        document.getElementById("sub2_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8345) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png";
                        document.getElementById("sub2_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8347) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png";
                        document.getElementById("sub3_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8310) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png";
                        document.getElementById("sub3_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8352) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png";
                        document.getElementById("sub3_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }
                }
                document.querySelector("#primaryMain img").src = "../images/perk-images/Styles/7203_Whimsy.png";
                document.querySelector("#keystone1 img").src = "../images/perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png";
                document.querySelector("#keystone2 img").src = "../images/perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png";
                document.querySelector("#keystone3 img").src = "../images/perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png";
                document.querySelector("#keystone4 img").src = "";
                document.getElementById("keystone4").classList.add("hidden");
                document.querySelector("#sub1_1 img").src = "../images/perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png";
                document.querySelector("#sub1_2 img").src = "../images/perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png";
                document.querySelector("#sub1_3 img").src = "../images/perk-images/Styles/Inspiration/PerfectTiming/PerfectTiming.png";
                document.querySelector("#sub2_1 img").src = "../images/perk-images/Styles/Inspiration/FuturesMarket/FuturesMarket.png";
                document.querySelector("#sub2_2 img").src = "../images/perk-images/Styles/Inspiration/MinionDematerializer/MinionDematerializer.png";
                document.querySelector("#sub2_3 img").src = "../images/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png";
                document.querySelector("#sub3_1 img").src = "../images/perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png";
                document.querySelector("#sub3_2 img").src = "../images/perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png";
                document.querySelector("#sub3_3 img").src = "../images/perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png";
                document.getElementById("sub3_4").classList.add("hidden");
            }
            // Resolve Primary
            else if (result[j].primaryStyleId == 8400) {
                if (result[j].subStyleId == 8000) {
                    document.getElementById("secondary1").classList.add("selected");
                } else if (result[j].subStyleId == 8100) {
                    document.getElementById("secondary2").classList.add("selected");
                } else if (result[j].subStyleId == 8300) {
                    document.getElementById("secondary4").classList.add("selected");
                } else if (result[j].subStyleId == 8200) {
                    document.getElementById("secondary3").classList.add("selected");
                }
                document.getElementById("main4").classList.add("selected");
                document.querySelector("#secondary1 img").src = "../images/perk-images/Styles/7201_Precision.png";
                document.querySelector("#secondary2 img").src = "../images/perk-images/Styles/7200_Domination.png";
                document.querySelector("#secondary3 img").src = "../images/perk-images/Styles/7202_Sorcery.png";
                document.querySelector("#secondary4 img").src = "../images/perk-images/Styles/7203_Whimsy.png";
                for (i = 0; i < perkIds.length - 1; i++) {
                    if (perkIds[i] == 8437) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png";
                        document.getElementById("keystone1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8439) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png";
                        document.getElementById("keystone2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8465) {
                        document.querySelector("#primaryKeystone img").src = "../images/perk-images/Styles/Resolve/Guardian/Guardian.png";
                        document.getElementById("keystone3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8446) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Resolve/Demolish/Demolish.png";
                        document.getElementById("sub1_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8463) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Resolve/FontOfLife/FontOfLife.png";
                        document.getElementById("sub1_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8401) {
                        document.querySelector("#sub1 img").src = "../images/perk-images/Styles/Resolve/MirrorShell/MirrorShell.png";
                        document.getElementById("sub1_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8429) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Resolve/Conditioning/Conditioning.png";
                        document.getElementById("sub2_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8444) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Resolve/SecondWind/SecondWind.png";
                        document.getElementById("sub2_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8473) {
                        document.querySelector("#sub2 img").src = "../images/perk-images/Styles/Resolve/BonePlating/BonePlating.png";
                        document.getElementById("sub2_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }

                    if (perkIds[i] == 8451) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png";
                        document.getElementById("sub3_1").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8453) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Resolve/Revitalize/Revitalize.png";
                        document.getElementById("sub3_2").classList.add("selected");
                        found[i] = perkIds[i];
                    } else if (perkIds[i] == 8242) {
                        document.querySelector("#sub3 img").src = "../images/perk-images/Styles/Sorcery/Unflinching/Unflinching.png";
                        document.getElementById("sub3_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }
                }
                document.querySelector("#primaryMain img").src = "../images/perk-images/Styles/7204_Resolve.png";
                document.querySelector("#keystone1 img").src = "../images/perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png";
                document.querySelector("#keystone2 img").src = "../images/perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png";
                document.querySelector("#keystone3 img").src = "../images/perk-images/Styles/Resolve/Guardian/Guardian.png";
                document.querySelector("#keystone4 img").src = "";
                document.getElementById("keystone4").classList.add("hidden");
                document.querySelector("#sub1_1 img").src = "../images/perk-images/Styles/Resolve/Demolish/Demolish.png";
                document.querySelector("#sub1_2 img").src = "../images/perk-images/Styles/Resolve/FontOfLife/FontOfLife.png";
                document.querySelector("#sub1_3 img").src = "../images/perk-images/Styles/Resolve/MirrorShell/MirrorShell.png";
                document.querySelector("#sub2_1 img").src = "../images/perk-images/Styles/Resolve/Conditioning/Conditioning.png";
                document.querySelector("#sub2_2 img").src = "../images/perk-images/Styles/Resolve/SecondWind/SecondWind.png";
                document.querySelector("#sub2_3 img").src = "../images/perk-images/Styles/Resolve/BonePlating/BonePlating.png";
                document.querySelector("#sub3_1 img").src = "../images/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png";
                document.querySelector("#sub3_2 img").src = "../images/perk-images/Styles/Resolve/Revitalize/Revitalize.png";
                document.querySelector("#sub3_3 img").src = "../images/perk-images/Styles/Sorcery/Unflinching/Unflinching.png";
                document.getElementById("sub3_4").classList.add("hidden");
            }

            let secondary = perkIds.filter(x => !found.includes(x));
            // Precision Secondary
            if (result[j].subStyleId == 8000) {
                if (secondary[0] == 9101 || secondary[0] == 9111 || secondary[0] == 8009) {
                    if (secondary[0] == 9101) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Precision/Overheal.png";
                        document.getElementById("sec1_1").classList.add("selected");
                    } else if (secondary[0] == 9111) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Precision/Triumph.png";
                        document.getElementById("sec1_2").classList.add("selected");
                    } else if (secondary[0] == 8909) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png";
                        document.getElementById("sec1_3").classList.add("selected");
                    }
                    if (secondary[1] == 9104) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[1] == 9105) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[1] == 9103) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8104) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8017) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Precision/CutDown/CutDown.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8299) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/LastStand/LastStand.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    }
                } else if (secondary[0] == 9104 || secondary[0] == 9105 || secondary[0] == 9103) {
                    if (secondary[0] == 9104) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[0] == 9105) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[0] == 9103) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8104) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8017) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Precision/CutDown/CutDown.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8299) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/LastStand/LastStand.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    }
                }
                document.querySelector("#secondaryMain img").src = "../images/perk-images/Styles/7201_Precision.png";
                document.querySelector("#sec1_1 img").src = "../images/perk-images/Styles/Precision/Overheal.png";
                document.querySelector("#sec1_2 img").src = "../images/perk-images/Styles/Precision/Triumph.png";
                document.querySelector("#sec1_3 img").src = "../images/perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png";
                document.querySelector("#sec2_1 img").src = "../images/perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png";
                document.querySelector("#sec2_2 img").src = "../images/perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png";
                document.querySelector("#sec2_3 img").src = "../images/perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png";
                document.querySelector("#sec3_1 img").src = "../images/perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png";
                document.querySelector("#sec3_2 img").src = "../images/perk-images/Styles/Precision/CutDown/CutDown.png";
                document.querySelector("#sec3_3 img").src = "../images/perk-images/Styles/Sorcery/LastStand/LastStand.png";
                document.getElementById("sec3_4").classList.add("hidden");
            }
            // Domination Secondary
            else if (result[j].subStyleId == 8100) {
                if (secondary[0] == 8126 || secondary[0] == 8139 || secondary[0] == 8143) {
                    if (secondary[0] == 8126) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Domination/CheapShot/CheapShot.png"
                        document.getElementById("sec1_1").classList.add("selected");
                    } else if (secondary[0] == 8139) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png";
                        document.getElementById("sec1_2").classList.add("selected");
                    } else if (secondary[0] == 8143) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png";
                        document.getElementById("sec1_3").classList.add("selected");
                    }
                    if (secondary[1] == 8136) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/ZombieWard/ZombieWard.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[1] == 8120) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/GhostPoro/GhostPoro.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[1] == 8138) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png";
                        document.getElementById("sec2_3").classList.add("selected");

                    }
                    if (secondary[1] == 8135) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8134) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/IngeniousHunter/IngeniousHunter.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8105) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    } else if (secondary[1] == 8106) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png";
                        document.getElementById("sec3_4").classList.add("selected");
                    }
                } else if (secondary[0] == 8136 || secondary[0] == 8120 || secondary[0] == 8138) {
                    if (secondary[0] == 8136) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Domination/ZombieWard/ZombieWard.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[0] == 8120) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Domination/GhostPoro/GhostPoro.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[0] == 8138) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png";
                        document.getElementById("sec2_3").classList.add("selected");

                    }
                    if (secondary[1] == 8135) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8134) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/IngeniousHunter/IngeniousHunter.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8105) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    } else if (secondary[1] == 8106) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png";
                        document.getElementById("sec3_4").classList.add("selected");
                    }
                }
                document.querySelector("#secondaryMain img").src = "../images/perk-images/Styles/7200_Domination.png";
                document.querySelector("#sec1_1 img").src = "../images/perk-images/Styles/Domination/CheapShot/CheapShot.png";
                document.querySelector("#sec1_2 img").src = "../images/perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png";
                document.querySelector("#sec1_3 img").src = "../images/perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png";
                document.querySelector("#sec2_1 img").src = "../images/perk-images/Styles/Domination/ZombieWard/ZombieWard.png";
                document.querySelector("#sec2_2 img").src = "../images/perk-images/Styles/Domination/GhostPoro/GhostPoro.png";
                document.querySelector("#sec2_3 img").src = "../images/perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png";
                document.querySelector("#sec3_1 img").src = "../images/perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png";
                document.querySelector("#sec3_2 img").src = "../images/perk-images/Styles/Domination/IngeniousHunter/IngeniousHunter.png";
                document.querySelector("#sec3_3 img").src = "../images/perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png";
                document.getElementById("sec3_4").classList.remove("hidden");
            }
            // Sorcery Secondary
            else if (result[j].subStyleId == 8200) {
                if (secondary[0] == 8224 || secondary[0] == 8226 || secondary[0] == 8275) {
                    if (secondary[0] == 8224) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Sorcery/NullifyingOrb/Pokeshield.png";
                        document.getElementById("sec1_1").classList.add("selected");

                    } else if (secondary[0] == 8226) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png";
                        document.getElementById("sec1_2").classList.add("selected");
                    } else if (secondary[0] == 8275) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Sorcery/NimbusCloak/6361.png";
                        document.getElementById("sec1_3").classList.add("selected");
                    }
                    if (secondary[1] == 8210) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Transcendence/Transcendence.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[1] == 8234) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Celerity/CelerityTemp.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[1] == 8233) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8237) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Scorch/Scorch.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8232) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8236) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    }
                } else if (secondary[0] == 8210 || secondary[0] == 8234 || secondary[0] == 8233) {
                    if (secondary[0] == 8210) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Sorcery/Transcendence/Transcendence.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[0] == 8234) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Sorcery/Celerity/CelerityTemp.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[0] == 8233) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8237) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Scorch/Scorch.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8232) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8236) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    }
                }
                document.querySelector("#secondaryMain img").src = "../images/perk-images/Styles/7202_Sorcery.png";
                document.querySelector("#sec1_1 img").src = "../images/perk-images/Styles/Sorcery/NullifyingOrb/Pokeshield.png";
                document.querySelector("#sec1_2 img").src = "../images/perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png";
                document.querySelector("#sec1_3 img").src = "../images/perk-images/Styles/Sorcery/NimbusCloak/6361.png";
                document.querySelector("#sec2_1 img").src = "../images/perk-images/Styles/Sorcery/Transcendence/Transcendence.png";
                document.querySelector("#sec2_2 img").src = "../images/perk-images/Styles/Sorcery/Celerity/CelerityTemp.png";
                document.querySelector("#sec2_3 img").src = "../images/perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png";
                document.querySelector("#sec3_1 img").src = "../images/perk-images/Styles/Sorcery/Scorch/Scorch.png";
                document.querySelector("#sec3_2 img").src = "../images/perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png";
                document.querySelector("#sec3_3 img").src = "../images/perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png";
                document.getElementById("sec3_4").classList.add("hidden");
            }
            // Inspiration Secondary
            else if (result[j].subStyleId == 8300) {
                if (secondary[0] == 8306 || secondary[0] == 8304 || secondary[0] == 8313) {
                    if (secondary[0] == 8306) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png";
                        document.getElementById("sec1_1").classList.add("selected");
                    } else if (secondary[0] == 8304) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png";
                        document.getElementById("sec1_2").classList.add("selected");
                    } else if (secondary[0] == 8313) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Inspiration/PerfectTiming/PerfectTiming.png";
                        document.getElementById("sec1_3").classList.add("selected");
                    }
                    if (secondary[1] == 8321) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Inspiration/FuturesMarket/FuturesMarket.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[1] == 8316) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Inspiration/MinionDematerializer/MinionDematerializer.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[1] == 8345) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8347) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8310) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8352) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    }
                } else if (secondary[0] == secondary[0] == 8321 || secondary[0] == 8316 || secondary[0] == 8345) {
                    if (secondary[0] == 8321) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Inspiration/FuturesMarket/FuturesMarket.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[0] == 8316) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Inspiration/MinionDematerializer/MinionDematerializer.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[0] == 8345) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8347) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8310) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8352) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png";
                        document.getElementById("sec3_3").classList.add("selected");
                    }
                }
                document.querySelector("#secondaryMain img").src = "../images/perk-images/Styles/7203_Whimsy.png";
                document.querySelector("#sec1_1 img").src = "../images/perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png";
                document.querySelector("#sec1_2 img").src = "../images/perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png";
                document.querySelector("#sec1_3 img").src = "../images/perk-images/Styles/Inspiration/PerfectTiming/PerfectTiming.png";
                document.querySelector("#sec2_1 img").src = "../images/perk-images/Styles/Inspiration/FuturesMarket/FuturesMarket.png";
                document.querySelector("#sec2_2 img").src = "../images/perk-images/Styles/Inspiration/MinionDematerializer/MinionDematerializer.png";
                document.querySelector("#sec2_3 img").src = "../images/perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png";
                document.querySelector("#sec3_1 img").src = "../images/perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png";
                document.querySelector("#sec3_2 img").src = "../images/perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png";
                document.querySelector("#sec3_3 img").src = "../images/perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png";
                document.getElementById("sec3_4").classList.add("hidden");
            }
            // Resolve Secondary
            else if (result[j].subStyleId == 8400) {
                if (secondary[0] == 8446 || secondary[0] == 8463 || secondary[0] == 8401) {
                    if (secondary[0] == 8446) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Resolve/Demolish/Demolish.png";
                        document.getElementById("sec1_1").classList.add("selected");
                    } else if (secondary[0] == 8463) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Resolve/FontOfLife/FontOfLife.png";
                        document.getElementById("sec1_2").classList.add("selected");
                    } else if (secondary[0] == 8401) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Resolve/MirrorShell/MirrorShell.png";
                        document.getElementById("sec1_3").classList.add("selected");
                    }
                    if (secondary[1] == 8429) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/Conditioning/Conditioning.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[1] == 8444) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/SecondWind/SecondWind.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[1] == 8473) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/BonePlating/BonePlating.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8451) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8453) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/Revitalize/Revitalize.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8442) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Unflinching/Unflinching.png";
                        document.getElementById("sec3_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }
                } else if (secondary[0] == 8429 || secondary[0] == 8444 || secondary[0] == 8473) {
                    if (secondary[0] == 8429) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Resolve/Conditioning/Conditioning.png";
                        document.getElementById("sec2_1").classList.add("selected");
                    } else if (secondary[0] == 8444) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Resolve/SecondWind/SecondWind.png";
                        document.getElementById("sec2_2").classList.add("selected");
                    } else if (secondary[0] == 8473) {
                        document.querySelector("#sec1 img").src = "../images/perk-images/Styles/Resolve/BonePlating/BonePlating.png";
                        document.getElementById("sec2_3").classList.add("selected");
                    }
                    if (secondary[1] == 8451) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png";
                        document.getElementById("sec3_1").classList.add("selected");
                    } else if (secondary[1] == 8453) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Resolve/Revitalize/Revitalize.png";
                        document.getElementById("sec3_2").classList.add("selected");
                    } else if (secondary[1] == 8442) {
                        document.querySelector("#sec2 img").src = "../images/perk-images/Styles/Sorcery/Unflinching/Unflinching.png";
                        document.getElementById("sec3_3").classList.add("selected");
                        found[i] = perkIds[i];
                    }
                }
                document.querySelector("#secondaryMain img").src = "../images/perk-images/Styles/7204_Resolve.png";
                document.querySelector("#sec1_1 img").src = "../images/perk-images/Styles/Resolve/Demolish/Demolish.png";
                document.querySelector("#sec1_2 img").src = "../images/perk-images/Styles/Resolve/FontOfLife/FontOfLife.png";
                document.querySelector("#sec1_3 img").src = "../images/perk-images/Styles/Resolve/MirrorShell/MirrorShell.png";
                document.querySelector("#sec2_1 img").src = "../images/perk-images/Styles/Resolve/Conditioning/Conditioning.png";
                document.querySelector("#sec2_2 img").src = "../images/perk-images/Styles/Resolve/SecondWind/SecondWind.png";
                document.querySelector("#sec2_3 img").src = "../images/perk-images/Styles/Resolve/BonePlating/BonePlating.png";
                document.querySelector("#sec3_1 img").src = "../images/perk-images/Styles/Resolve/Overgrowth/Overgrowth.png";
                document.querySelector("#sec3_2 img").src = "../images/perk-images/Styles/Resolve/Revitalize/Revitalize.png";
                document.querySelector("#sec3_3 img").src = "../images/perk-images/Styles/Sorcery/Unflinching/Unflinching.png";
                document.getElementById("sec3_4").classList.add("hidden");
            }

            // Stats            
            if (stats[0] == 5005) {
                document.querySelector("#stat1 img").src = "../images/perk-images/StatMods/StatModsAttackSpeedIcon.png";
                document.getElementById("stat1_2").classList.add("selected");
            } else if (stats[0] == 5007) {
                document.querySelector("#stat1 img").src = "../images/perk-images/StatMods/StatModsCDRScalingIcon.png";
                document.getElementById("stat1_3").classList.add("selected");
            } else if (stats[0] == 5008) {
                document.querySelector("#stat1 img").src = "../images/perk-images/StatMods/StatModsAdaptiveForceIcon.png";
                document.getElementById("stat1_1").classList.add("selected");
            }

            if (stats[1] == 5008) {
                document.querySelector("#stat2 img").src = "../images/perk-images/StatMods/StatModsAdaptiveForceIcon.png";
                document.getElementById("stat2_1").classList.add("selected");
            } else if (stats[1] == 5002) {
                document.querySelector("#stat2 img").src = "../images/perk-images/StatMods/StatModsArmorIcon.png";
                document.getElementById("stat2_2").classList.add("selected");
            } else if (stats[1] == 5003) {
                document.querySelector("#stat2 img").src = "../images/perk-images/StatMods/StatModsMagicResIcon.png";
                document.getElementById("stat2_3").classList.add("selected");
            }

            if (stats[2] == 5001) {
                document.querySelector("#stat3 img").src = "../images/perk-images/StatMods/StatModsHealthScalingIcon.png";
                document.getElementById("stat3_1").classList.add("selected");
            } else if (stats[2] == 5002) {
                document.querySelector("#stat3 img").src = "../images/perk-images/StatMods/StatModsArmorIcon.png";
                document.getElementById("stat3_2").classList.add("selected");
            } else if (stats[2] == 5003) {
                document.querySelector("#stat3 img").src = "../images/perk-images/StatMods/StatModsMagicResIcon.png";
                document.getElementById("stat3_3").classList.add("selected");
            }

        },
        saverunes: async (rune) => {
            const result = await ipcRenderer.invoke('saverunes', rune);
            console.log('Runes saved');
        },
        saveclient: async (champ) => {
            const result = await ipcRenderer.invoke('saveclient', champ);
            if (result.id) {
                console.log('Rune page #' + result.id + ' saved');
                document.getElementById('runenum').textContent = result.id;
            } else {
                console.log('error when getting rune id')
            }
            console.log('Runes saved from client');
        },
        deletepage: async (champ, runenum) => {
            const result = await ipcRenderer.invoke('deletepage', champ, runenum);
            if (result !== 0) {
                console.log('Rune page #' + runenum + ' removed from database.');
            } else {
                console.log('error when deleting rune page from database')
            }
        },
        searchchamps: async (search, role) => {
            const allcsv = await ipcRenderer.invoke('allcsv');
            const allchamps = allcsv[1];
            const allids = allcsv[0];

            const champroles = await ipcRenderer.invoke('champroles');
            let rolefiltered = [];
            if (role === 'All') {
                rolefiltered = allchamps;
            } else {
                allids.forEach(async (id) => {
                    if (id) {
                        if (champroles[id][role] !== '') {
                            rolefiltered.push(champroles[id].Name);
                        }
                    }
                })
            }

            let slow = search.toLowerCase();
            let champs = [];
            rolefiltered.forEach(async (item) => {
                if (item) {
                    low = item.toLowerCase();
                    if (low.includes(slow)) {
                        champs.push(item);
                    }
                }
            })
            let notsearched = allchamps.filter(x => !champs.includes(x)).concat(champs.filter(x => !allchamps.includes(x)));

            champs.forEach(async (item) => {
                document.getElementById(item).classList.remove("hidden");
            })
            notsearched.forEach(async (item) => {
                document.getElementById(item).classList.add("hidden");
            })
        },
    },


}

contextBridge.exposeInMainWorld('api', API);
