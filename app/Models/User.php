<?php

namespace App\Models;

//use Illuminate\Database\Eloquent\Model;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
//use illuminate\Database\Eloquent\Relations\HasMany;
//use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
//use Illuminate\Notifications\Notifiable;
//use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
   protected $table = 'users';
   protected $fillable = ['login', 'password', 'name', 'surname', 'age'];
}
