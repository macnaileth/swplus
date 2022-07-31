/* 
 * Objects containing needed manuals for JSON processing
 */

//icf JSON - claml exported
import icfJSON from "../data/json/icf.json";
//icd10 JSON - HL7 FHIR version of ICD-10-GM 2020 DE
import icdJSON from "../data/json/icd.json";
//modifiers for ICD-10 as separate file from ICD-10-GM 2022 DE ClaML version
import icdModJSON from "../data/json/icd_modifiers.json";

const manualsWHO = {};

manualsWHO.icf = icfJSON.ClaML;
manualsWHO.icd = icdJSON.concept; //-> start at node concept parsing
manualsWHO.icdMod = icdModJSON;
manualsWHO.icdAdd = {   
                        "R": "Rechts",
                        "L": "Links",
                        "B": "Beidseitig",
                        "A": "Ausgeschlossene Diagnose",
                        "G": "Gesicherte Diagnose",
                        "V": "Verdachtsdiagnose",
                        "Z": "Zustand nach der betreffenden Diagnose"
                    };
manualsWHO.icfComps = {   
                        "b": "Körperfunktionen",
                        "s": "Körperstruktur",
                        "d": "Aktivitäten und Partizipation",
                        "e": "Umweltfaktoren"
                    };                    
manualsWHO.icdChaps = {   
                        "I": "Bestimmte infektiöse und parasitäre Krankheiten",
                        "II": "Neubildungen",
                        "III": "Krankheiten des Blutes und der blutbildenden Organe sowie bestimmte Störungen mit Beteiligung des Immunsystems",
                        "IV": "Endokrine, Ernährungs- und Stoffwechselkrankheiten",
                        "V": "Psychische und Verhaltensstörungen",
                        "VI": "Krankheiten des Nervensystems",
                        "VII": "Krankheiten des Auges und der Augenanhangsgebilde",
                        "VIII": "Krankheiten des Ohres und des Warzenfortsatzes",
                        "IX": "Krankheiten des Kreislaufsystems",
                        "X": "Krankheiten des Atmungssystems",
                        "XI": "Krankheiten des Verdauungssystems",
                        "XII": "Krankheiten der Haut und der Unterhaut",
                        "XIII": "Krankheiten des Muskel-Skelett-Systems und des Bindegewebes",
                        "XIV": "Krankheiten des Urogenitalsystems",
                        "XV": "Schwangerschaft, Geburt und Wochenbett",
                        "XVI": "Bestimmte Zustände, die ihren Ursprung in der Perinatalperiode haben",
                        "XVII": "Angeborene Fehlbildungen, Deformitäten und Chromosomenanomalien",
                        "XVIII": "Symptome und abnorme klinische und Laborbefunde, die anderenorts nicht klassifiziert sind",
                        "XIX": "Verletzungen, Vergiftungen und bestimmte andere Folgen äußerer Ursachen",
                        "XX": "Äußere Ursachen von Morbidität und Mortalität",
                        "XXI": "Faktoren, die den Gesundheitszustand beeinflussen und zur Inanspruchnahme des Gesundheitswesens führen",
                        "XXII": "Schlüsselnummern für besondere Zwecke"
                    };    

export default manualsWHO;


