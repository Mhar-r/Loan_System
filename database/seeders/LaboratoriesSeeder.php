<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LaboratoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        DB::table('laboratories')->insert([
            ['name' => 'Eleana'],
            ['name' => 'Comdig'],
            ['name' => 'IngSof'],
            ['name' => 'Antenas'],
        ]);
    }
}
