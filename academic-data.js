export const DATA={
 subjects:[
  {id:'phy',name:'Physics',nameHi:'भौतिक विज्ञान',classes:['11','12'],description:'Physics learning structure and practice.'},
  {id:'chem',name:'Chemistry',nameHi:'रसायन विज्ञान',classes:['11','12'],description:'Chemistry learning structure and practice.'},
  {id:'bio',name:'Biology',nameHi:'जीव विज्ञान',classes:['11','12'],description:'Biology learning structure and practice.'},
  {id:'eng',name:'English',nameHi:'अंग्रेज़ी',classes:['11','12'],description:'English learning structure and practice.'},
  {id:'hin',name:'Hindi',nameHi:'हिन्दी',classes:['11','12'],description:'Hindi learning structure and practice.'}
 ],
 chapters:[
  {id:'phy11-1',classId:'11',subjectId:'phy',title:'Units and Measurements',titleHi:'मात्रक और मापन',description:'Measurement, units and dimensions.'},
  {id:'phy11-2',classId:'11',subjectId:'phy',title:'Motion in a Straight Line',titleHi:'सरल रेखा में गति',description:'Position, velocity and acceleration.'},
  {id:'chem11-1',classId:'11',subjectId:'chem',title:'Some Basic Concepts of Chemistry',titleHi:'रसायन विज्ञान की मूल अवधारणाएँ',description:'Atoms, moles and chemical calculations.'},
  {id:'bio11-1',classId:'11',subjectId:'bio',title:'The Living World',titleHi:'जीव जगत',description:'Living organisms and biological organisation.'},
  {id:'eng11-1',classId:'11',subjectId:'eng',title:'Reading and Communication',titleHi:'पठन और संचार',description:'Reading comprehension and communication.'},
  {id:'hin11-1',classId:'11',subjectId:'hin',title:'भाषा और अभिव्यक्ति',titleHi:'भाषा और अभिव्यक्ति',description:'Language and expression.'},
  {id:'phy12-1',classId:'12',subjectId:'phy',title:'Electrostatics',titleHi:'स्थिर वैद्युतिकी',description:'Electric charge, field and potential.'},
  {id:'chem12-1',classId:'12',subjectId:'chem',title:'Solutions',titleHi:'विलयन',description:'Concentration and solution properties.'},
  {id:'bio12-1',classId:'12',subjectId:'bio',title:'Reproduction',titleHi:'प्रजनन',description:'Reproductive biology.'},
  {id:'eng12-1',classId:'12',subjectId:'eng',title:'Advanced Reading',titleHi:'उन्नत पठन',description:'Reading and response.'},
  {id:'hin12-1',classId:'12',subjectId:'hin',title:'साहित्य और अभिव्यक्ति',titleHi:'साहित्य और अभिव्यक्ति',description:'Literature and expression.'}
 ],
 concepts:[
  {id:'phy11c1',classId:'11',chapterId:'phy11-1',topic:'Measurement',title:'SI Units',titleHi:'SI मात्रक',summary:'Base and derived SI units.'},
  {id:'phy11c2',classId:'11',chapterId:'phy11-2',topic:'Velocity',title:'Velocity',titleHi:'वेग',summary:'Velocity as displacement per unit time.'},
  {id:'chem11c1',classId:'11',chapterId:'chem11-1',topic:'Mole Concept',title:'Mole',titleHi:'मोल',summary:'Amount of substance and Avogadro constant.'},
  {id:'bio11c1',classId:'11',chapterId:'bio11-1',topic:'Characteristics',title:'Characteristics of Life',titleHi:'जीवन की विशेषताएँ',summary:'Core characteristics used to identify living systems.'},
  {id:'eng11c1',classId:'11',chapterId:'eng11-1',topic:'Reading',title:'Main Idea',titleHi:'मुख्य विचार',summary:'Identify the central idea of a passage.'},
  {id:'hin11c1',classId:'11',chapterId:'hin11-1',topic:'Expression',title:'Effective Expression',titleHi:'प्रभावी अभिव्यक्ति',summary:'Clear and appropriate language expression.'},
  {id:'phy12c1',classId:'12',chapterId:'phy12-1',topic:'Charge',title:'Electric Charge',titleHi:'वैद्युत आवेश',summary:'Basic properties of electric charge.'},
  {id:'chem12c1',classId:'12',chapterId:'chem12-1',topic:'Concentration',title:'Molarity',titleHi:'मोलरता',summary:'Molarity as amount of solute per litre of solution.'},
  {id:'bio12c1',classId:'12',chapterId:'bio12-1',topic:'Reproduction',title:'Reproductive Strategies',titleHi:'प्रजनन रणनीतियाँ',summary:'Overview of reproductive processes.'},
  {id:'eng12c1',classId:'12',chapterId:'eng12-1',topic:'Inference',title:'Inference',titleHi:'निष्कर्ष',summary:'Infer meaning from textual evidence.'},
  {id:'hin12c1',classId:'12',chapterId:'hin12-1',topic:'Literature',title:'Literary Response',titleHi:'साहित्यिक प्रतिक्रिया',summary:'Respond to literary ideas with evidence.'}
 ],
 questions:[
  {id:'q-phy11-1',classId:'11',subjectId:'phy',conceptId:'phy11c1',title:'SI Unit Check',text:'What is the SI base unit of length?',type:'mcq',answer:'metre',explanation:'The SI base unit of length is metre.',aiGenerated:false},
  {id:'q-phy11-2',classId:'11',subjectId:'phy',conceptId:'phy11c2',title:'Velocity Check',text:'Velocity is displacement divided by what quantity?',type:'short',answer:'time',explanation:'Velocity is displacement per unit time.',aiGenerated:false},
  {id:'q-chem11-1',classId:'11',subjectId:'chem',conceptId:'chem11c1',title:'Mole Check',text:'Approximately how many particles are in one mole?',type:'short',answer:'6.022e23',explanation:'One mole contains approximately 6.022 × 10^23 entities.',aiGenerated:false},
  {id:'q-bio11-1',classId:'11',subjectId:'bio',conceptId:'bio11c1',title:'Life Check',text:'Name one characteristic commonly used to describe living organisms.',type:'short',answer:'growth',explanation:'Growth is one commonly discussed characteristic of living organisms.',aiGenerated:false},
  {id:'q-eng11-1',classId:'11',subjectId:'eng',conceptId:'eng11c1',title:'Reading Check',text:'What do we call the central message of a passage?',type:'short',answer:'main idea',explanation:'The central message is the main idea.',aiGenerated:false},
  {id:'q-hin11-1',classId:'11',subjectId:'hin',conceptId:'hin11c1',title:'अभिव्यक्ति जाँच',text:'स्पष्ट भाषा में विचार रखने की एक विशेषता लिखिए।',type:'short',answer:'स्पष्टता',explanation:'स्पष्टता प्रभावी अभिव्यक्ति की महत्वपूर्ण विशेषता है।',aiGenerated:false},
  {id:'q-phy12-1',classId:'12',subjectId:'phy',conceptId:'phy12c1',title:'Charge Check',text:'What is the SI unit of electric charge?',type:'short',answer:'coulomb',explanation:'The SI unit of electric charge is coulomb.',aiGenerated:false},
  {id:'q-chem12-1',classId:'12',subjectId:'chem',conceptId:'chem12c1',title:'Molarity Check',text:'Molarity is expressed as moles of solute per what volume?',type:'short',answer:'litre',explanation:'Molarity is moles of solute per litre of solution.',aiGenerated:false},
  {id:'q-bio12-1',classId:'12',subjectId:'bio',conceptId:'bio12c1',title:'Reproduction Check',text:'What is one broad purpose of reproduction?',type:'short',answer:'continuity',explanation:'Reproduction supports continuity of a species.',aiGenerated:false},
  {id:'q-eng12-1',classId:'12',subjectId:'eng',conceptId:'eng12c1',title:'Inference Check',text:'What is an inference?',type:'short',answer:'conclusion',explanation:'An inference is a conclusion drawn from evidence.',aiGenerated:false},
  {id:'q-hin12-1',classId:'12',subjectId:'hin',conceptId:'hin12c1',title:'साहित्य जाँच',text:'साहित्यिक प्रतिक्रिया में किस चीज़ का सहारा लेना उपयोगी है?',type:'short',answer:'प्रमाण',explanation:'पाठ से प्रमाण/साक्ष्य लेकर प्रतिक्रिया को मजबूत किया जा सकता है।',aiGenerated:false}
 ],
 resources:[
  {id:'ncert-11-phy',classId:'11',subjectId:'phy',title:'NCERT Physics Class 11 — resource metadata',source:'NCERT',provenance:'External official source; user-controlled access'},
  {id:'ncert-11-chem',classId:'11',subjectId:'chem',title:'NCERT Chemistry Class 11 — resource metadata',source:'NCERT',provenance:'External official source; user-controlled access'},
  {id:'ncert-11-bio',classId:'11',subjectId:'bio',title:'NCERT Biology Class 11 — resource metadata',source:'NCERT',provenance:'External official source; user-controlled access'}
 ]
};
