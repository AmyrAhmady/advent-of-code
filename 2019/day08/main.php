<?php
$input = file_get_contents("input.txt");

class _Size {
    public $width = 25;
    public $height = 6;
}
$Size = new _Size();

$layers = str_split($input, $Size->width * $Size->height);
$zero_count_in_layers = array_map(function($i) 
{
    return substr_count($i, '0');
}, $layers);

asort($zero_count_in_layers);

$target = $layers[array_key_first($zero_count_in_layers)];

echo "Part1 answer: " . substr_count($target, '1') * substr_count($target, '2') . "\n\n";

$pic = [];
foreach ($layers as $i) 
{
    foreach (str_split($i) as $j => $a) 
    {
        if(!isset($pic[$j]) || $pic[$j] == 2) 
            $pic[$j] = $a;
    }
}

echo "Part2 answer: \n\n";
for ($y=0; $y < $Size->height; $y++) { 
    $line = substr(implode('', $pic), $y * $Size->width, $Size->width);
    $line = str_replace([0, 1], [' ', '#'], $line);
    echo $line . "\n";
}
echo "\n";

?>