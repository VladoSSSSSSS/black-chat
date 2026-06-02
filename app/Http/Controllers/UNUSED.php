private function allPathsToNewSaves() {
    $pathsArray = [
        '/LocalLow/Nokta Games/Supermarket Simulator',
        '/Roaming/Goldberg SocialClub Emu Saves/GTA IV/0F74F4C4'
    ];
    return $pathsArray;
}

private function allPathsToSaveStorage() {
    $pathsArray = [
        '/Supermarket Simulator',
        '/Grand Theft Auto IV'
    ];
    return $pathsArray;
}

public function getSavesList(Request $request) {
    $game = $request->query()['game'];
    $saves = Storage::disk('appdata')->files($this->allPathsToNewSaves()[$game]);
    $savesTrim = Array();
    foreach($saves as $k => $v) {
        $savesTrim[] = basename($v);
    }
    return view('chatEngine.allSaves', ['saves' => $savesTrim, 'game' => $game]);
}

public function storage() {
    return view('chatEngine.allGames');
}

public function copySaves(Request $request) {
    $subFolderName = date('d-m-Y_H-i-s').'_'.Str::random(8);
    $game = $request->all()['game'];
    $targetFolder = $this->allPathsToSaveStorage()[$game];
    $fullpath = $targetFolder.'/'.$subFolderName;
    Storage::disk('saveStorage')->makeDirectory($fullpath);
    
    return '1';
}